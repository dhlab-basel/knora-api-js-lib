import { JsonObject, JsonProperty } from "json2typescript";
import { ILoginResponse } from "../../../interfaces/models/v2/i-login-response";

/**
 * @category Model
 */
@JsonObject("LoginResponse")
export class LoginResponse implements ILoginResponse {

    @JsonProperty("token", String)
    token: string = "";

}
