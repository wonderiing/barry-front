
import axios from "axios"

const generalGet = async (endpoint: string) => {

    try {

        const response = await axios.get(endpoint)

        return response.data
    } catch (err) {
        console.error(err)
    }
}