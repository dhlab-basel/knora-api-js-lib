import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../../Constants";
import { IdConverter } from "../../custom-converters/id-converter";

@JsonObject("CreateOntology")
export class CreateOntology {

    @JsonProperty(Constants.AttachedToProject, IdConverter)
    projectIri: string = "";

    @JsonProperty(Constants.Label, String)
    label: string = "";

    @JsonProperty(Constants.OntologyName, String)
    name: string = "";

}
