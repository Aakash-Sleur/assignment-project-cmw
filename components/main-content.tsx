import {convertLinesToBulletPoints, formatSalary, getHoursAgo} from "@/libs/helper";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Grid,
    RangeSlider,
    Select,
    Text,
    TextInput,
} from "@mantine/core";
import React, {use, useCallback, useEffect, useRef, useState} from "react";
import {
    FiBriefcase,
    FiChevronDown,
    FiClock,
    FiDollarSign,
    FiMapPin,
    FiSearch,
    FiUsers,
} from "react-icons/fi";
import {GoStack} from "react-icons/go";
import {LuUserPlus} from "react-icons/lu";
import Loader from "@/components/Loader";
import NoContent from "@/components/NoContent";

const companyLogos = {
    Google: "/images/google.jpg",
    Amazon: "/images/amazon.png",
    Tesla: "/images/tesla.jpg",
    TCS: "/images/tcs.jpg",
    Microsoft: "/images/microsoft.png",
    Swiggy: "/images/swiggy.webp",
    "Byju's": "/images/byjus.png",
    Paytm: "/images/paytm.png",
    Flipkart: "/images/flipkart.png",
    Accenture: "/images/accenture.png",
};

interface Props {
    refresh: Boolean
    title: string | null
    location: string | null
    jobType: string | null
    salaryRange: [number, number]
}

const MainContentSection = ({refresh, title, jobType, salaryRange, location}: Props) => {
    const [jobCards, setJobCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = useCallback(
        async (filters: {
            salaryMin: number;
            salaryMax: number;
            jobType?: string | null;
            location?: string | null;
            title?: string | null;
        }) => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams({
                    minSalary: filters.salaryMin.toString(),
                    maxSalary: filters.salaryMax.toString(),
                    jobType: filters.jobType ?? "",
                    location: filters.location ?? "",
                    jobTitle: filters.title ?? "",
                });

                const response = await fetch(`/api/jobs?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch jobs");
                }

                const data = await response.json();
                setJobCards(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const filterParams = {
            salaryMin: salaryRange[0] * 1000,
            salaryMax: salaryRange[1] * 1000,
            jobType,
            location,
            title,
        };

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchJobs(filterParams);
        }, 500); // 500ms debounce delay
    }, [salaryRange, jobType, location, title, fetchJobs, refresh]);

    return (
        <div className="main-content">
            {isLoading ? (
                <Loader/>
            ) : jobCards.length == 0 && !isLoading ? (
                <NoContent/>
            ) : (
                <Grid gutter="lg" className="jobs-grid">
                    {jobCards.map((job) => (
                        <Grid.Col key={job.id} span={{base: 12, sm: 6, lg: 3}}>
                            <Card shadow="sm" padding="lg" radius="md" className="job-card">
                                {/* Header with Logo and Time */}
                                <div className="job-header">
                                    <div className="avatar-container">
                                            {companyLogos[job.company_name as keyof typeof companyLogos] ? (
                                                <Avatar size="lg" radius="xl">
                                                    <img
                                                        src={companyLogos[job.company_name as keyof typeof companyLogos]}
                                                        alt={job.company_name}
                                                        style={{
                                                            objectFit: "contain",
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Avatar>
                                            ) : (
                                                <Avatar size="lg" radius="xl" color="gray">
                                                    <span style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "100%",
                                                        height: "100%",
                                                        fontWeight: "bold",
                                                        fontSize: "1.5rem",
                                                        color: "#fff",
                                                        background: "#888",
                                                        borderRadius: "50%"
                                                    }}>
                                                        {job.company_name?.charAt(0)?.toUpperCase() || "?"}
                                                    </span>
                                                </Avatar>
                                            )}
                                    </div>
                                    <Badge
                                        variant="light"
                                        className="time-badge"
                                        style={{textTransform: "none"}}
                                    >
                                        {getHoursAgo(job.created_at)}
                                    </Badge>
                                </div>

                            {/* Job Title */}
                                <div className="job-title">{job.job_title}</div>

                                {/* Job Details */}
                                <div className="job-metadata">
                                    <div className="metadata-item">
                                        <LuUserPlus size={16} className="metadata-icon"/>
                                        <span style={{color: "#555555", fontWeight: 500}}>1-3 yr Exp</span>
                                    </div>
                                    <div className="metadata-item">
                                        <img src={"/building.svg"} style={{}} className="metadata-icon" alt="building"/>
                                        <span style={{color: "#555555", fontWeight: 500}}>Onsite</span>
                                    </div>
                                    <div className="metadata-item">
                                        <GoStack size={16} color={"#555555"} className="metadata-icon"/>
                                        <span style={{color: "#555555", fontWeight: 500}}>{formatSalary(job.max_salary * 12)}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <ul className="job-description">
                                    {convertLinesToBulletPoints(job?.description)
                                        .map((point, index) => (
                                            <li key={index}>
                                                {point}
                                            </li>
                                        ))}
                                </ul>

                                {/* Apply Button */}
                                <Button
                                    fullWidth
                                    radius="md"
                                    size="md"
                                    className="apply-button"
                                >
                                    Apply Now
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
            {/* Job Cards Grid */}
        </div>
    );
};

export default MainContentSection;
