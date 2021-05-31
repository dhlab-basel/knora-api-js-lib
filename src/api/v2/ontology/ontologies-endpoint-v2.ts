import { Observable } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map, mergeMap } from "rxjs/operators";
import { ApiResponseData } from "../../../models/api-response-data";
import { ApiResponseError } from "../../../models/api-response-error";
import { Constants } from "../../../models/v2/Constants";
import { CreateOntology } from "../../../models/v2/ontologies/create/create-ontology";
import {
    CreateResourceClass,
    CreateResourceClassPayload
} from "../../../models/v2/ontologies/create/create-resource-class";
import {
    CreateResourceProperty,
    CreateResourcePropertyPayload
} from "../../../models/v2/ontologies/create/create-resource-property";
import { DeleteOntology } from "../../../models/v2/ontologies/delete/delete-ontology";
import { DeleteOntologyResponse } from "../../../models/v2/ontologies/delete/delete-ontology-response";
import { DeleteResourceClass } from "../../../models/v2/ontologies/delete/delete-resource-class";
import { DeleteResourceProperty } from "../../../models/v2/ontologies/delete/delete-resource-property";
import { OntologiesMetadata, OntologyMetadata } from "../../../models/v2/ontologies/ontology-metadata";
import { OntologyConversionUtil } from "../../../models/v2/ontologies/OntologyConversionUtil";
import { CanDoResponse } from "../../../models/v2/ontologies/read/can-do-response";
import { ReadOntology } from "../../../models/v2/ontologies/read/read-ontology";
import { ResourceClassDefinitionWithAllLanguages } from "../../../models/v2/ontologies/resource-class-definition";
import { ResourcePropertyDefinitionWithAllLanguages } from "../../../models/v2/ontologies/resource-property-definition";
import { UpdateOntology } from "../../../models/v2/ontologies/update/update-ontology";
import { UpdateOntologyMetadata } from "../../../models/v2/ontologies/update/update-ontology-metadata";
import { UpdateResourceClassCardinality } from "../../../models/v2/ontologies/update/update-resource-class-cardinality";
import { UpdateResourceClassComment } from "../../../models/v2/ontologies/update/update-resource-class-comment";
import { UpdateResourceClassLabel } from "../../../models/v2/ontologies/update/update-resource-class-label";
import { UpdateResourcePropertyComment } from "../../../models/v2/ontologies/update/update-resource-property-comment";
import { UpdateResourcePropertyLabel } from "../../../models/v2/ontologies/update/update-resource-property-label";
import { Endpoint } from "../../endpoint";

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require("jsonld/dist/jsonld.js");

/**
 * Handles requests to the ontologies route of the Knora API.
 *
 * @category Endpoint V2
 */
export class OntologiesEndpointV2 extends Endpoint {

    /**
     * Requests metadata about all ontologies from Knora.
     */
    getOntologiesMetadata(): Observable<OntologiesMetadata | ApiResponseError> {

        return this.httpGet("/metadata").pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertOntologiesList(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Requests an ontology from Knora.
     *
     * @param ontologyIri the IRI of the ontology to be requested.
     * @param allLanguages gets labels and comments in all languages, if  set to true.
     */
    getOntology(ontologyIri: string, allLanguages = false): Observable<ReadOntology | ApiResponseError> {

        let allLangSegment = "";
        if (allLanguages) {
            allLangSegment = "?allLanguages=true";
        }

        // TODO: Do not hard-code the URL and http call params, generate this from Knora
        return this.httpGet("/allentities/" + encodeURIComponent(ontologyIri) + allLangSegment).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertOntology(jsonldobj, this.jsonConvert, this.knoraApiConfig, allLanguages);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Requests metadata about all ontologies from a specific project.
     *
     * @param projectIri the IRI of the project.
     */
    getOntologiesByProjectIri(projectIri: string): Observable<OntologiesMetadata | ApiResponseError> {

        return this.httpGet("/metadata/" + encodeURIComponent(projectIri)).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertOntologiesList(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Creates a new ontology.
     *
     * @param ontology The ontology to be created
     */
    createOntology(ontology: CreateOntology): Observable<OntologyMetadata | ApiResponseError> {

        const onto = this.jsonConvert.serializeObject(ontology);

        return this.httpPost("", onto).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, OntologyMetadata);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Checks whether an existing ontology can be deleted.
     *
     * @param ontologyIri the Iri of the ontology to be checked.
     */
    canDeleteOntology(ontologyIri: string): Observable<CanDoResponse | ApiResponseError> {

        return this.httpGet("/candeleteontology/" + encodeURIComponent(ontologyIri)).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, CanDoResponse);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Deletes an ontology.
     *
     * @param ontology the ontology to be deleted.
     */
    deleteOntology(ontology: DeleteOntology): Observable<DeleteOntologyResponse | ApiResponseError> {

        const path = "/" + encodeURIComponent(ontology.id) + "?lastModificationDate=" + encodeURIComponent(ontology.lastModificationDate);

        return this.httpDelete(path).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }),
            map(jsonldobj => {
                return this.jsonConvert.deserializeObject(jsonldobj, DeleteOntologyResponse);
            }),
            catchError(error => this.handleError(error))
        );

    }

    /**
     * Updates the metadata of an ontology.
     *
     * @param ontologyMetadata The ontology metadata to be updated
     */
    updateOntology(ontologyMetadata: UpdateOntologyMetadata): Observable<OntologyMetadata | ApiResponseError> {
        // label and comment cannot both be undefined
        if (ontologyMetadata.label === undefined && ontologyMetadata.comment === undefined) {
            throw new Error("Label and comment cannot both be undefined. At least one must be defined.");
        }

        // label cannot be an empty string
        if (ontologyMetadata.label !== undefined && ontologyMetadata.label.trim() === "") {
            throw new Error("Label cannot be an empty string.");
        }

        // comment can be an empty string but we must make an additional API request to remove the comment
        if (ontologyMetadata.comment !== undefined && ontologyMetadata.comment.trim() === "") {
            // set the comment to undefined because the API will not accept an empty string
            ontologyMetadata.comment = undefined;

            // request to remove the comment
            return this.deleteOntologyComment(ontologyMetadata).pipe(
                mergeMap((res: OntologyMetadata) => {
                    // update the lastModificationDate since the DELETE request changed it
                    ontologyMetadata.lastModificationDate = res.lastModificationDate!;

                    // update the metadata, which in this case is only the label
                    return this.updateOntologyMetadata(ontologyMetadata)
                })
            );
        } else { // if label and/or comment are defined and not empty strings, make the API request to update the metadata
            return this.updateOntologyMetadata(ontologyMetadata);
        }
    }

    /**
     * Removes the comment from the metadata of an ontology.
     *
     * @param ontologyMetadata The ontology metadata to be updated
     */
    deleteOntologyComment(ontologyMetadata: UpdateOntologyMetadata): Observable<OntologyMetadata | ApiResponseError> {

        if(ontologyMetadata.id === undefined || ontologyMetadata.lastModificationDate === undefined) {
            throw new Error('Missing IRI or lastModificationDate');
        }

        return this.httpDelete(`/comment/${encodeURIComponent(ontologyMetadata.id)}?lastModificationDate=${encodeURIComponent(ontologyMetadata.lastModificationDate)}`).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, OntologyMetadata);
            })
        );
    }

    /**
     * The PUT request for updating the metadata of an ontology.
     *
     * @param ontologyMetadata The ontology metadata to be updated
     */
    private updateOntologyMetadata(ontologyMetadata: UpdateOntologyMetadata): Observable<OntologyMetadata | ApiResponseError> {
        const onto = this.jsonConvert.serializeObject(ontologyMetadata);

        return this.httpPut("/metadata", onto).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, OntologyMetadata);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Creates a resource class without cardinalities.
     *
     * @param  resourceClass The resource class to be created.
     */
    createResourceClass(resourceClass: UpdateOntology<CreateResourceClass>): Observable<ResourceClassDefinitionWithAllLanguages | ApiResponseError> {

        const resClassPay = new CreateResourceClassPayload();

        resClassPay.id = resourceClass.id + Constants.HashDelimiter + resourceClass.entity.name;
        resClassPay.label = resourceClass.entity.label;
        resClassPay.comment = (resourceClass.entity.comment.length ? resourceClass.entity.comment : resourceClass.entity.label);
        resClassPay.subClassOf = resourceClass.entity.subClassOf;
        resClassPay.type = Constants.Class;

        const ontoPayload = this.jsonConvert.serializeObject(resourceClass);

        ontoPayload["@graph"] = [this.jsonConvert.serializeObject(resClassPay)];

        return this.httpPost("/classes", ontoPayload).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourceClassResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Updates a resource class's label or comment.
     *
     * @param updateResourceClass the new label or comment.
     */
    updateResourceClass(updateResourceClass: UpdateOntology<UpdateResourceClassLabel | UpdateResourceClassComment>): Observable<ResourceClassDefinitionWithAllLanguages | ApiResponseError> {

        const ontoPayload = this.jsonConvert.serializeObject(updateResourceClass);

        ontoPayload["@graph"] = [this.jsonConvert.serializeObject(updateResourceClass.entity)];

        return this.httpPut("/classes", ontoPayload).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourceClassResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Updates a property's label or comment.
     *
     * @param updateProperty the new label or comment.
     */
    updateResourceProperty(updateProperty: UpdateOntology<UpdateResourcePropertyLabel | UpdateResourcePropertyComment>): Observable<ResourcePropertyDefinitionWithAllLanguages | ApiResponseError> {

        const ontoPayload = this.jsonConvert.serializeObject(updateProperty);

        ontoPayload["@graph"] = [this.jsonConvert.serializeObject(updateProperty.entity)];

        return this.httpPut("/properties", ontoPayload).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourcePropertyResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Checks whether an existing resource class cn be deleted.
     *
     * @param resourceClassIri the iri of the resource class to be checked.
     */
    canDeleteResourceClass(resourceClassIri: string): Observable<CanDoResponse | ApiResponseError> {

        return this.httpGet("/candeleteclass/" + encodeURIComponent(resourceClassIri)).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, CanDoResponse);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Deletes a resource class.
     *
     * @param deleteResourceClass with class IRI.
     */
    deleteResourceClass(deleteResourceClass: DeleteResourceClass): Observable<OntologyMetadata | ApiResponseError> {

        const path = "/classes/" + encodeURIComponent(deleteResourceClass.id) + "?lastModificationDate=" + encodeURIComponent(deleteResourceClass.lastModificationDate);

        return this.httpDelete(path).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }),
            map(jsonldobj => {
                return this.jsonConvert.deserializeObject(jsonldobj, OntologyMetadata);
            }),
            catchError(error => this.handleError(error))
        );

    }

    /**
     * Creates a resource property.
     *
     * @param  resourceProperties the resource property to be created.
     */
    createResourceProperty(resourceProperties: UpdateOntology<CreateResourceProperty>): Observable<ResourcePropertyDefinitionWithAllLanguages | ApiResponseError> {

        const resPropPay = new CreateResourcePropertyPayload();

        resPropPay.id = resourceProperties.id + Constants.HashDelimiter + resourceProperties.entity.name;

        resPropPay.label = resourceProperties.entity.label;
        resPropPay.comment = (resourceProperties.entity.comment.length ? resourceProperties.entity.comment : resourceProperties.entity.label);
        resPropPay.subPropertyOf = resourceProperties.entity.subPropertyOf;

        resPropPay.subjectType = resourceProperties.entity.subjectType;
        resPropPay.objectType = resourceProperties.entity.objectType;

        if (resourceProperties.entity.guiElement) {
            resPropPay.guiElement = resourceProperties.entity.guiElement;
        }
        if (resourceProperties.entity.guiAttributes) {
            resPropPay.guiAttributes = resourceProperties.entity.guiAttributes;
        }

        const ontoPayload = this.jsonConvert.serializeObject(resourceProperties);

        ontoPayload["@graph"] = [this.jsonConvert.serializeObject(resPropPay)];

        return this.httpPost("/properties", ontoPayload).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourcePropertyResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

    /**
     * Checks whether an existing property can be deleted.
     *
     * @param propertyIri the iri of the property to be checked.
     */
    canDeleteResourceProperty(propertyIri: string): Observable<CanDoResponse | ApiResponseError> {

        return this.httpGet("/candeleteproperty/" + encodeURIComponent(propertyIri)).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, CanDoResponse);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Deletes a resource property.
     *
     * @param  deleteResourceProperty with property IRI.
     */
    deleteResourceProperty(deleteResourceProperty: DeleteResourceProperty): Observable<OntologyMetadata | ApiResponseError> {

        const path = "/properties/" + encodeURIComponent(deleteResourceProperty.id) + "?lastModificationDate=" + encodeURIComponent(deleteResourceProperty.lastModificationDate);

        return this.httpDelete(path).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }),
            map(jsonldobj => {
                return this.jsonConvert.deserializeObject(jsonldobj, OntologyMetadata);
            }),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Adds cardinalities for properties to a resource class.
     *
     * @param addCardinalityToResourceClass the cardinalities to be added.
     */
    addCardinalityToResourceClass(addCardinalityToResourceClass: UpdateOntology<UpdateResourceClassCardinality>): Observable<ResourceClassDefinitionWithAllLanguages | ApiResponseError> {

        if (addCardinalityToResourceClass.entity.cardinalities.length === 0) {
            throw new Error("At least one cardinality must be defined.");
        }

        const onto = this.jsonConvert.serializeObject(addCardinalityToResourceClass);

        const cardinalities = this.jsonConvert.serializeObject(addCardinalityToResourceClass.entity);

        onto["@graph"] = [cardinalities];

        return this.httpPost("/cardinalities", onto).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourceClassResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Checks whether existing cardinalities can be replaced for a given resource class.
     *
     * @param resourceClassIri the iri of the resource class to be checked.
     */
    canReplaceCardinalityOfResourceClass(resourceClassIri: string): Observable<CanDoResponse | ApiResponseError> {

        return this.httpGet("/canreplacecardinalities/" + encodeURIComponent(resourceClassIri)).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return this.jsonConvert.deserializeObject(jsonldobj, CanDoResponse);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Replaces cardinalities for properties to a resource class.
     *
     * @param replaceCardinalityOfResourceClass the cardinalities to be added.
     */
    replaceCardinalityOfResourceClass(replaceCardinalityOfResourceClass: UpdateOntology<UpdateResourceClassCardinality>): Observable<ResourceClassDefinitionWithAllLanguages | ApiResponseError> {

        const onto = this.jsonConvert.serializeObject(replaceCardinalityOfResourceClass);

        const numberOfCards = replaceCardinalityOfResourceClass.entity.cardinalities.length;

        const cardinalities = this.jsonConvert.serializeObject(replaceCardinalityOfResourceClass.entity);

        // remove subClassOf if no cards are provided
        // all cards will be removed from resource class
        if (numberOfCards === 0) {
            delete cardinalities[Constants.SubClassOf];
        }

        onto["@graph"] = [cardinalities];

        return this.httpPut("/cardinalities", onto).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                // TODO: @rosenth Adapt context object
                // TODO: adapt getOntologyIriFromEntityIri
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourceClassResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );

    }

    /**
     * Updates gui order of cardinalities
     * @param replaceGuiOrder
     */
    replaceGuiOrderOfCardinalities(replaceGuiOrder: UpdateOntology<UpdateResourceClassCardinality>): Observable<ResourceClassDefinitionWithAllLanguages | ApiResponseError> {
        const onto = this.jsonConvert.serializeObject(replaceGuiOrder);

        const cardinalities = this.jsonConvert.serializeObject(replaceGuiOrder.entity);

        onto["@graph"] = [cardinalities];

        return this.httpPut("/guiorder", onto).pipe(
            mergeMap((ajaxResponse: AjaxResponse) => {
                return jsonld.compact(ajaxResponse.response, {});
            }), map((jsonldobj: object) => {
                return OntologyConversionUtil.convertResourceClassResponse(jsonldobj, this.jsonConvert);
            }),
            catchError(error => {
                return this.handleError(error);
            })
        );
    }

}
