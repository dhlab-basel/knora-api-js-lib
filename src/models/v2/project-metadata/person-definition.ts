import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../Constants";
import { Address } from "./address-definition";
import { Organization } from "./organization-definition";

@JsonObject("Person")
export class Person {
    
    @JsonProperty(Constants.dspRepoBase + "hasAddress", Address)
    address: Address = new Address();

    @JsonProperty(Constants.dspRepoBase + "hasEmail", URL)
    email: URL = new URL(""); 

    @JsonProperty(Constants.dspRepoBase + "hasFamilyName", String)
    fmilyName: string = "";

    @JsonProperty(Constants.dspRepoBase + "hasGivenName", String)
    givenName: string = "";

    @JsonProperty(Constants.dspRepoBase + "hasJobTitle", String)
    jobTitle: string = "";

    @JsonProperty(Constants.dspRepoBase + "hasRole", String)
    role: string = "";

    @JsonProperty(Constants.dspRepoBase + "isMemberOf", Organization)
    memberOf: Organization = new Organization();
}
