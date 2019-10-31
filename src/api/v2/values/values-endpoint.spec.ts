import { Constants, CreateValue } from "../../..";
import { MockAjaxCall } from "../../../../test/mockajaxcall";
import { KnoraApiConfig } from "../../../knora-api-config";
import { KnoraApiConnection } from "../../../knora-api-connection";
import { UpdateResource } from "../../../models/v2/resources/update/update-resource";
import { CreateIntValue } from "../../../models/v2/resources/values/create/create-int-value";
import { DeleteValue } from "../../../models/v2/resources/values/delete/delete-value";
import { DeleteValueResponse } from "../../../models/v2/resources/values/delete/delete-value-response";
import { UpdateIntValue } from "../../../models/v2/resources/values/update/update-int-value";
import { UpdateValue } from "../../../models/v2/resources/values/update/update-value";
import { WriteValueResponse } from "../../../models/v2/resources/values/write-value-response";

const config = new KnoraApiConfig("http", "localhost", 3333, undefined, undefined, true);
const knoraApiConnection = new KnoraApiConnection(config);

describe("ValuesEndpoint", () => {

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe("Method updateValue", () => {

        it("should update a value", done => {

            const updateIntVal = new UpdateIntValue();

            updateIntVal.id = "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rg";
            updateIntVal.type = Constants.IntValue;
            updateIntVal.int = 2;

            const updateResource = new UpdateResource<UpdateValue>();

            updateResource.id = "http://rdfh.ch/0001/a-thing";
            updateResource.type = "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing";
            updateResource.property = "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger";
            updateResource.value = updateIntVal;

            knoraApiConnection.v2.values.updateValue(updateResource).subscribe(
                (res: WriteValueResponse) => {
                    expect(res.id).toEqual("http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh");
                    done();
                }
            );

            const request = jasmine.Ajax.requests.mostRecent();

            request.respondWith(MockAjaxCall.mockResponse(JSON.stringify({
                "@id": "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh",
                "@type": Constants.IntValue
            })));

            expect(request.url).toBe("http://localhost:3333/v2/values");

            expect(request.method).toEqual("PUT");

            expect(request.requestHeaders).toEqual({"Content-Type": "application/json; charset=utf-8"});

            const expectedPayload = {
                "@type": "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing",
                "@id": "http://rdfh.ch/0001/a-thing",
                "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger": {
                    "@type": "http://api.knora.org/ontology/knora-api/v2#IntValue",
                    "@id": "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rg",
                    "http://api.knora.org/ontology/knora-api/v2#intValueAsInt": 2
                }
            };

            expect(request.data()).toEqual(expectedPayload);
        });
    });

    describe("Method createValue", () => {

        it("should create a value", done => {

            const createIntVal = new CreateIntValue();

            createIntVal.type = Constants.IntValue;
            createIntVal.int = 5;

            const updateResource = new UpdateResource<CreateValue>();

            updateResource.id = "http://rdfh.ch/0001/a-thing";
            updateResource.type = "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing";
            updateResource.property = "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger";
            updateResource.value = createIntVal;

            knoraApiConnection.v2.values.createValue(updateResource).subscribe(
                (res: WriteValueResponse) => {
                    expect(res.id).toEqual("http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh");
                    done();
                }
            );

            const request = jasmine.Ajax.requests.mostRecent();

            request.respondWith(MockAjaxCall.mockResponse(JSON.stringify({
                "@id": "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh",
                "@type": Constants.IntValue
            })));

            expect(request.url).toBe("http://localhost:3333/v2/values");

            expect(request.method).toEqual("POST");

            expect(request.requestHeaders).toEqual({"Content-Type": "application/json; charset=utf-8"});

            const expectedPayload = {
                "@type": "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing",
                "@id": "http://rdfh.ch/0001/a-thing",
                "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger": {
                    "@type": "http://api.knora.org/ontology/knora-api/v2#IntValue",
                    "http://api.knora.org/ontology/knora-api/v2#intValueAsInt": 5
                }
            };

            expect(request.data()).toEqual(expectedPayload);

        });
    });

    describe("Method deleteValue", () => {

        it("should delete a value", done => {

            const deleteVal = new DeleteValue();

            deleteVal.id = "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh";
            deleteVal.type = "http://api.knora.org/ontology/knora-api/v2#IntValue";

            const updateResource = new UpdateResource<DeleteValue>();

            updateResource.id = "http://rdfh.ch/0001/a-thing";
            updateResource.type = "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing";
            updateResource.property = "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger";

            updateResource.value = deleteVal;

            knoraApiConnection.v2.values.deleteValue(updateResource).subscribe(
                (res: DeleteValueResponse) => {
                    expect(res.result).toEqual("Value <http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg> marked as deleted");
                    done();
                }
            );

            const request = jasmine.Ajax.requests.mostRecent();

            request.respondWith(MockAjaxCall.mockResponse(JSON.stringify(
                {
                    "knora-api:result": "Value <http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg> marked as deleted",
                    "@context": {
                        "knora-api": "http://api.knora.org/ontology/knora-api/v2#"
                    }
                }
            )));

            expect(request.url).toBe("http://localhost:3333/v2/values/delete");

            expect(request.method).toEqual("POST");

            const expectedPayload = {
                "@type": "http://0.0.0.0:3333/ontology/0001/anything/v2#Thing",
                "@id": "http://rdfh.ch/0001/a-thing",
                "http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger": {
                    "@type": "http://api.knora.org/ontology/knora-api/v2#IntValue",
                    "@id": "http://rdfh.ch/0001/a-thing/values/vp96riPIRnmQcbMhgpv_Rh"
                }
            };

            expect(request.data()).toEqual(expectedPayload);

        });


    });
});
