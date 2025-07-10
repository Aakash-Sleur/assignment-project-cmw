import React, {Dispatch, SetStateAction, useState} from "react";
import {
    Modal,
    Textarea,
    NumberInput,
    Text,
    Stack,
    Grid,
    TextInput,
    Select,
    Group,
    Button,
} from "@mantine/core";
import {DateInput} from "@mantine/dates";
import {
    FiBriefcase,
    FiCalendar,
    FiChevronDown,
    FiDollarSign,
    FiMapPin,
} from "react-icons/fi";
import {RiArrowUpDownLine} from "react-icons/ri";
import {LuArrowUpDown} from "react-icons/lu";
import {FaAnglesDown} from "react-icons/fa6";
import {jobTypes, locations} from "@/libs/constants";
import {MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";

type JobForm = {
    jobTitle: string;
    companyName: string;
    location: string;
    jobType: string;
    minSalary: number | null;
    maxSalary: number | null;
    deadLine: Date | null;
    description: string;
};

type CreateJobModalProps = {
    opened: boolean;
    close: () => void;
    setRefetch: Dispatch<SetStateAction<Boolean>>;
};

type ValidationErrors = {
    jobTitle?: string;
    companyName?: string;
    location?: string;
    jobType?: string;
    salaryMin?: string;
    salaryMax?: string;
    applicationDeadline?: string;
    jobDescription?: string;
};

const InitialFormData = {
    jobTitle: "",
    companyName: "",
    location: "",
    jobType: "",
    salaryMin: null,
    salaryMax: null,
    applicationDeadline: null as Date | null,
    jobDescription: "",
}

const CreateJobModal = ({opened, close, setRefetch}: CreateJobModalProps) => {
    const [jobForm, setJobForm] = useState(InitialFormData);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Job Title validation
        if (!jobForm.jobTitle.trim()) {
            newErrors.jobTitle = "Job title is required";
        } else if (jobForm.jobTitle.trim().length < 2) {
            newErrors.jobTitle = "Job title must be at least 2 characters";
        } else if (jobForm.jobTitle.trim().length > 100) {
            newErrors.jobTitle = "Job title must be less than 100 characters";
        }

        // Company Name validation
        if (!jobForm.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        } else if (jobForm.companyName.trim().length < 2) {
            newErrors.companyName = "Company name must be at least 2 characters";
        } else if (jobForm.companyName.trim().length > 100) {
            newErrors.companyName = "Company name must be less than 100 characters";
        }

        // Location validation
        if (!jobForm.location) {
            newErrors.location = "Location is required";
        }

        // Job Type validation
        if (!jobForm.jobType) {
            newErrors.jobType = "Job type is required";
        }

        // Salary validation
        if (jobForm.salaryMin == null || jobForm.salaryMin <= 0) {
            newErrors.salaryMin = "Minimum salary must be greater than 0";
        }

        if (jobForm.salaryMax == null || jobForm.salaryMax <= 0) {
            newErrors.salaryMax = "Maximum salary must be greater than 0";
        }

        if (jobForm.salaryMin == null || jobForm.salaryMax == null || jobForm.salaryMin > 0 && jobForm.salaryMax > 0 && jobForm.salaryMin >= jobForm.salaryMax) {
            newErrors.salaryMax = "Maximum salary must be greater than minimum salary";
        }

        // Application Deadline validation
        if (!jobForm.applicationDeadline) {
            newErrors.applicationDeadline = "Application deadline is required";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(jobForm.applicationDeadline);
            deadlineDate.setHours(0, 0, 0, 0);

            if (deadlineDate <= today) {
                newErrors.applicationDeadline = "Application deadline must be in the future";
            }
        }

        // Job Description validation
        if (!jobForm.jobDescription.trim()) {
            newErrors.jobDescription = "Job description is required";
        } else if (jobForm.jobDescription.trim().length < 20) {
            newErrors.jobDescription = "Job description must be at least 20 characters";
        } else if (jobForm.jobDescription.trim().length > 5000) {
            newErrors.jobDescription = "Job description must be less than 5000 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const jobData: JobForm = {
                companyName: jobForm.companyName.trim(),
                jobTitle: jobForm.jobTitle.trim(),
                location: jobForm.location,
                jobType: jobForm.jobType,
                minSalary: jobForm.salaryMin,
                maxSalary: jobForm.salaryMax,
                deadLine: jobForm.applicationDeadline,
                description: jobForm.jobDescription.trim(),
            };
            console.log("Job Data Submitted:", jobData);

            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit job data");
            }

            setJobForm(InitialFormData);
            setErrors({});
            setRefetch(true);
            close();
        } catch (error) {
            console.error("Error submitting job data:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof typeof jobForm, value: any) => {
        setJobForm({...jobForm, [field]: value});

        // Clear error when user starts typing
        if (errors[field as keyof ValidationErrors]) {
            setErrors({...errors, [field]: undefined});
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title={
                <div style={{width: "100%", textAlign: "center"}}>
                    <Text style={{fontSize: "24px"}} fw={600} c="dark">
                        Create Job Opening
                    </Text>
                </div>
            }
            size="xl"
            radius="lg"
            centered
            color={"white"}
            p={"xl"}
            withCloseButton={false}
            overlayProps={{
                backgroundOpacity: 0.45,
            }}
            className="create-job-modal"
        >
            <Stack gap="lg" style={{padding: "20px 10px 10px"}}>
                <Grid gutter="md">
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Job Title
                            </Text>
                            <TextInput
                                placeholder="Full Stack Developer"
                                value={jobForm.jobTitle}
                                onChange={(e) =>
                                    handleInputChange("jobTitle", e.currentTarget.value)
                                }
                                radius="md"
                                size="md"
                                style={{fontWeight: 400}}
                                error={errors.jobTitle}
                            />
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Company Name
                            </Text>
                            <TextInput
                                placeholder="Amazon, Microsoft, Swiggy"
                                value={jobForm.companyName}
                                onChange={(e) =>
                                    handleInputChange("companyName", e.currentTarget.value)
                                }
                                radius="md"
                                size="md"

                                style={{
                                    fontWeight: 400, '&::placeholder': {
                                        fontSize: '10px', // Adjust the font size as needed
                                    },
                                }}
                                error={errors.companyName}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Grid gutter="md">
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Location
                            </Text>
                            <Select
                                placeholder="Choose Preferred Location"
                                rightSection={<FiChevronDown color={"#222222"} size={22}/>}
                                value={jobForm.location}
                                onChange={(value) =>
                                    handleInputChange("location", value || "")
                                }
                                radius="md"
                                size="md"
                                data={locations}
                                style={{fontWeight: 400}}
                                error={errors.location}
                            />
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Job Type
                            </Text>
                            <Select
                                placeholder="FullTime"
                                rightSection={<FiChevronDown color={"#222222"} size={22}/>}
                                value={jobForm.jobType}
                                onChange={(value) =>
                                    handleInputChange("jobType", value || "")
                                }
                                radius="md"
                                size="md"
                                data={jobTypes}
                                style={{fontWeight: 400}}
                                error={errors.jobType}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Grid gutter="md">
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Salary Range
                            </Text>
                            <Group gap="md">
                                <NumberInput
                                    placeholder="₹0"
                                    leftSection={<LuArrowUpDown color={"#BCBCBC"} size={16}/>}
                                    value={jobForm.salaryMin ?? undefined}
                                    onChange={(value) =>
                                        handleInputChange("salaryMin", Number(value) || 0)
                                    }
                                    radius="md"
                                    size="md"
                                    hideControls
                                    thousandSeparator=","
                                    prefix="₹"
                                    flex={1}
                                    style={{fontWeight: 400}}
                                    error={errors.salaryMin}
                                />
                                <NumberInput
                                    placeholder="₹12,00,000"
                                    leftSection={<LuArrowUpDown color={"#BCBCBC"} size={16}/>}
                                    value={jobForm.salaryMax ?? undefined}
                                    onChange={(value) =>
                                        handleInputChange("salaryMax", Number(value) || 0)
                                    }
                                    radius="md"
                                    size="md"
                                    hideControls
                                    thousandSeparator=","
                                    prefix="₹"
                                    flex={1}
                                    style={{fontWeight: 400}}
                                    error={errors.salaryMax}
                                />
                            </Group>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Stack style={{gap: "1px"}}>
                            <Text size="sm" fw={600} c="dark">
                                Application Deadline
                            </Text>
                            <DateInput
                                rightSection={<FiCalendar size={16}/>}
                                value={jobForm.applicationDeadline}
                                onChange={(value) => {
                                    let dateValue: Date | null = null;
                                    if (typeof value === "string" && value) {
                                        dateValue = new Date(value);
                                    } else if (value && (value as any) instanceof Date) {
                                        dateValue = new Date(value);
                                    }
                                    handleInputChange("applicationDeadline", dateValue);
                                }}
                                radius="md"
                                size="md"
                                style={{fontWeight: 400}}
                                error={errors.applicationDeadline}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Stack style={{gap: "1px"}}>
                    <Text size="md" fw={600} c="dark">
                        Job Description
                    </Text>
                    <Textarea
                        placeholder="Please share a description to let the candidate know more about the job role"
                        value={jobForm.jobDescription}
                        onChange={(e) =>
                            handleInputChange("jobDescription", e.currentTarget.value)
                        }
                        radius="md"
                        size="lg"
                        autosize
                        minRows={6}
                        maxRows={6}
                        style={{fontWeight: 400}}
                        error={errors.jobDescription}
                    />
                </Stack>

                <Group justify="space-between" mt="md">
                    <Button
                        variant="outline"
                        color="black"
                        radius="md"
                        size="lg"
                        style={{
                            border: "1.5px solid #222222",
                            padding: "12px 45px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                            boxShadow: "0px 0px 24px 0px #A9A9A940"

                        }}
                        disabled={isSubmitting}
                    >
                        <span>Save Draft</span>
                        <FaAnglesDown fontWeight={500} size={10} style={{marginLeft: "8px"}}/>
                    </Button>
                    <Button
                        radius="md"
                        size="lg"
                        style={{
                            backgroundColor: "#00AAFF",
                            padding: "12px 45px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                        }}
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        <span>Publish</span>
                        <MdOutlineKeyboardDoubleArrowRight fontWeight={800} size={16} style={{marginLeft: "8px"}} />
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default CreateJobModal;