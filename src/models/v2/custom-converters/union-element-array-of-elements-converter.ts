import { JsonConvert, JsonConverter, JsonCustomConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { PropertyMatchingRule } from "json2typescript/src/json2typescript/json-convert-enums";
import { Constants } from "../Constants";
import { Attribution } from "../project-metadata/attribution";
import { Grant } from "../project-metadata/grant";
import { Place } from "../project-metadata/place";

/**
 * @category Internal
 */
@JsonConverter
export class UnionElementArrayOfElementsConverter implements JsonCustomConvert
<Attribution | Attribution[] | Place | Place[] | Grant | Grant[]> {

    static jsonConvert: JsonConvert = new JsonConvert(
        OperationMode.ENABLE,
        ValueCheckingMode.DISALLOW_NULL,
        false,
        PropertyMatchingRule.CASE_STRICT
    );
    
    serialize(el: Attribution[] | Place[] | Grant[]): any {
        if (Array.isArray(el)) {
            switch (true) {
                case el[0].hasOwnProperty("type") && (el[0] as {type: string})["type"] === Constants.ProvAttribution:
                    return UnionElementArrayOfElementsConverter.jsonConvert.serializeArray(el, Attribution);
                case el[0].hasOwnProperty("type") && (el[0] as Grant)["type"] === Constants.DspGrant:
                    return UnionElementArrayOfElementsConverter.jsonConvert.serializeArray(el, Grant);
                case el[0].hasOwnProperty("place"):
                    return UnionElementArrayOfElementsConverter.jsonConvert.serializeArray(el, Place);
            }
        } else {
            throw new Error(`Serialization Error: expected Attribution[], Grant[] or Place[] type.
                Instead got ${typeof el}.`);
        }
    }

    deserialize(el: any ): Grant | Place | Attribution[] | Grant[] | Place[] {
        if (Array.isArray(el)) {
            switch (true) {
                case el[0].hasOwnProperty("@type") && el[0]["@type"] === Constants.ProvAttribution:
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray(el, Attribution);
                case el[0].hasOwnProperty("@type") && el[0]["@type"] === Constants.DspGrant:
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray(el, Grant);
                case (el[0].hasOwnProperty("@type") && el[0]["@type"] === Constants.SchemaPlace) 
                // below condition is temp solution for data sent from the test app, due to different structure
                    || el[0].hasOwnProperty(Constants.SchemaUrlValue):
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray(el, Place);
                default:
                    throw new Error(`Deserialization Error: expected an array of objects with property @type equals to: 
                        ${Constants.ProvAttribution}, ${Constants.DspGrant}, or ${Constants.SchemaPlace}.`);
            }
        } else {
            switch (true) {
                case el.hasOwnProperty("@type") && el["@type"] === Constants.ProvAttribution:
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray([el], Attribution);
                case el.hasOwnProperty("@type") && el["@type"] === Constants.DspGrant:
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray([el], Grant);
                case (el.hasOwnProperty("@type") && el["@type"] === Constants.SchemaPlace) 
                // below condition is temp solution for data sent from the test app, due to different structure
                    || el.hasOwnProperty(Constants.SchemaUrlValue):
                    return UnionElementArrayOfElementsConverter.jsonConvert.deserializeArray([el], Place);
                default:
                    throw new Error(`Deserialization Error: expected an object with property @type equals to: 
                        ${Constants.ProvAttribution}, ${Constants.DspGrant}, or ${Constants.SchemaPlace}.`);
            }
        }
    }
}