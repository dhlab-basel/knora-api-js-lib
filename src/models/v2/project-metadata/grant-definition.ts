import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../Constants";
import { PersonOrganizationConverter } from "../custom-converters/person-organization-converter";
import { UrlToStringConverter } from "../custom-converters/url-to-string-converter";
import { Organization } from "./organization-definition";
import { Person } from "./person-definition";

@JsonObject("Grant")
export class Grant {

    @JsonProperty(Constants.dspRepoBase + "hasFunder", PersonOrganizationConverter, true)
    funder?: Person | Organization = undefined;

    @JsonProperty(Constants.dspRepoBase + "hasName", String, true)
    name?: string = undefined;

    @JsonProperty(Constants.dspRepoBase + "hasNumber", String, true)
    number?: string = undefined;

    @JsonProperty(Constants.dspRepoBase + "hasURL", UrlToStringConverter, true)
    url?: string = undefined;
}