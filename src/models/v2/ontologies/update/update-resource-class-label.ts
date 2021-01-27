import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../../Constants";
import { StringLiteralToStringLiteralArrayConverter } from "../../custom-converters/string-literal-to-string-literal-array-converter";
import { StringLiteralV2 } from "../../string-literal-v2";
import { UpdateResourceClass } from "./update-resource-class";

/**
 * @category Model V2
 */
@JsonObject("UpdateResourceClassLabel")
export class UpdateResourceClassLabel extends UpdateResourceClass {

    @JsonProperty(Constants.Label, StringLiteralToStringLiteralArrayConverter)
    labels: StringLiteralV2[] = [];

}
