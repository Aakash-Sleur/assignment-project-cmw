import {Box, Text, Image, Stack} from "@mantine/core";

const NoContent = ({
                       title = "No Results Found",
                       subtitle = "Try adjusting your filters or search criteria.",
                       image = "/images/nocontent.svg", // Add this image to your public folder
                   }: {
    title?: string;
    subtitle?: string;
    image?: string;
}) => {
    return (
        <Box
            style={{
                textAlign: "center",
                padding: "40px 20px",
            }}
        >
            <Stack align="center" gap="sm">
                <Image
                    src={image}
                    alt="No content illustration"
                    width={200}
                    height={200}
                    fit="contain"
                />
                <Text size="xl" fw={600} c="dark">
                    {title}
                </Text>
                <Text size="sm" c="dimmed">
                    {subtitle}
                </Text>
            </Stack>
        </Box>
    );
};

export default NoContent;
