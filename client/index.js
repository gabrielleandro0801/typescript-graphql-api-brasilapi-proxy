import { gql, GraphQLClient, } from "graphql-request";

// The only purpose of this file is to test the server
async function main() {
    const endpoint = "http://127.0.0.1:3000/graphql";
    const client = new GraphQLClient(endpoint, {
        keepalive: true,
    });

    try {
        const command = gql`
            query Bank {
                bank(ispb: "13370835") {
                    code
                    ispb
                    name
                }
                cep(cep: "01310930") {
                    state
                    city
                    neighborhood
                    street
                }
                cnpj(cnpj: "00000000000191") {
                    name
                    zipCode
                    foundationDate
                    phoneNumber
                }
                banks {
                    code
                    ispb
                    name
                }
            }
        `;

        const response = await client.request(command);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

main();
