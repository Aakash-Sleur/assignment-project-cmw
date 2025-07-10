import {Text} from "@mantine/core"
import "../styles/_loader.styles.css"
const Loader = () => {
    return (
        <div className="loading-section">
            <div className="spinner-container">
                <div className="spinner" />
                <Text size="lg" fw={600} mt="md" c="dimmed">
                    Loading jobs...
                </Text>
            </div>
        </div>

    )
}

export default Loader;