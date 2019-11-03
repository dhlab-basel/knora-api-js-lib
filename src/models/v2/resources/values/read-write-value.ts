import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../../Constants";
import { BaseValue } from "./base-value";

@JsonObject("ReadWriteValue")
export abstract class ReadWriteValue extends BaseValue {

    @JsonProperty(Constants.ValueHasComment, String, true)
    valueHasComment?: string = undefined;

}
