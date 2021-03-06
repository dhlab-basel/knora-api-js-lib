import { JsonObject, JsonProperty } from "json2typescript";
import { IUrl } from "../../../interfaces/models/v2/project-metadata-interfaces";
import { Constants } from "../Constants";
import { UnionUrlStringConverter } from "../custom-converters/union-url-string-converter";
import { BaseProjectMetadata } from "./base-project-metadata";

/** 
 * @category Model V2 
 */ 
@JsonObject("DataManagementPlan")
export class DataManagementPlan extends BaseProjectMetadata {

    @JsonProperty("@id", String)
    id: string = "";

    @JsonProperty(Constants.DspHasURL, UnionUrlStringConverter, true)
    url?: IUrl[] = undefined;

    @JsonProperty(Constants.DspIsAvailable, Boolean, true)
    isAvailable?: boolean = undefined;

    constructor() {
        super(Constants.DspDataManagementPlan);
    }
}
