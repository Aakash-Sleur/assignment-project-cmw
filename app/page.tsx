"use client"

import React, {useState} from "react"
import {
    Container,
    Group,
    Button,
    TextInput,
    Select,
    Card,
    Text,
    Badge,
    Grid,
    Stack,
    Avatar,
    RangeSlider,
    Paper,
    Modal,
    Textarea,
    NumberInput,
} from "@mantine/core"
import {DateInput} from "@mantine/dates"
import {useDisclosure} from "@mantine/hooks"
import {
    FiSearch,
    FiMapPin,
    FiUsers,
    FiBriefcase,
    FiDollarSign,
    FiCalendar,
    FiClock,
    FiChevronDown,
} from "react-icons/fi"
import "./globals.scss"
import CreateJobModal from "@/components/create-job-modal"
import MainContentSection from "@/components/main-content"
import {RiUserVoiceLine} from "react-icons/ri";

export default function JobSearchPlatform() {
    const [opened, {open, close}] = useDisclosure(false);
    const [refresh, setRefresh] = useState<Boolean>(false);
    const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200]);
    const [jobType, setJobType] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    return (
        <div className="job-search-app">
            {/* Navbar Section */}
            <div className="navbar-section">
                <Container size="xl" className="navbar-container">
                    <Paper shadow="sm" radius="xl" p="md" className="navbar-paper">
                        <div className="navbar-content">
                            {/* Logo */}
                            <div className="logo-container">
                                <img src="https://www.cybermindworks.com/images/cmwlogo.svg" alt="Logo"
                                     className="logo-image"/>
                            </div>

                            {/* Navigation */}
                            <div className="navigation-links">
                                <span className="nav-item active">Home</span>
                                <span className="nav-item">Find Jobs</span>
                                <span className="nav-item">Find Talents</span>
                                <span className="nav-item">About us</span>
                                <span className="nav-item">Testimonials</span>
                            </div>

                            {/* Create Jobs Button */}
                            <Button radius="xl" size="md" className="create-jobs-btn" onClick={open}>
                                Create Jobs
                            </Button>
                        </div>
                    </Paper>
                </Container>
                <div className="search-section">
                    <Grid gutter="md" align="end" className="search-grid">
                        {/* Job Search */}
                        <Grid.Col span={{base: 12, md: 3}} className="search-field">
                            <TextInput
                                placeholder="Search By Job Title, Role"
                                leftSection={<FiSearch size={20}/>}
                                style={{color: "#686868", fontWeight: 500}}
                                onChange={(event) => setTitle(event.currentTarget.value)}
                                size="md"
                                radius="md"
                            />
                        </Grid.Col>

                        {/* Location */}
                        <Grid.Col span={{base: 12, md: 3}} className="search-field">
                            <Select
                                placeholder="Preferred Location"
                                leftSection={<FiMapPin size={20}/>}
                                rightSection={<FiChevronDown size={16}/>}
                                style={{color: "#686868", fontWeight: 500}}
                                onChange={(value) => setLocation(value)}
                                size="md"
                                radius="md"
                                data={[
                                    {value: "bangalore", label: "Bangalore"},
                                    {value: "chennai", label: "Chennai"},
                                    {value: "mumbai", label: "Mumbai"},
                                    {value: "delhi", label: "Delhi"},
                                    {value: "noida", label: "Noida"},
                                    {value: "hyderabad", label: "Hyderabad"},
                                    {value: "pune", label: "Pune"},
                                ]}
                            />
                        </Grid.Col>

                        {/* Job Type */}
                        <Grid.Col span={{base: 12, md: 3}} className="search-field">
                            <Select
                                placeholder="Job type"
                                leftSection={<RiUserVoiceLine  size={20}/>}
                                onChange={(value) => setJobType(value)}
                                style={{color: "#686868", fontWeight: 500}}
                                rightSection={<FiChevronDown size={16}/>}
                                size="md"
                                radius="md"
                                data={[
                                    {value: "Internship", label: "Internship"},
                                    {value: "Full-Time", label: "Full Time"},
                                    {value: "Part-Time", label: "Part Time"},
                                    {value: "Contract", label: "Contract"},
                                ]}
                            />
                        </Grid.Col>

                        {/* Salary Range */}
                        <Grid.Col span={{base: 12, md: 3}} className="salary-range-field">
                            <div className="salary-range-container">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text size="md" fw={600} color={"#000000"}>
                                        Salary Per Month
                                    </Text>
                                    <div className="salary-labels">
                                        <Text size="md" fw={600} c="dark" style={{marginRight: "4px", color: "#000000" }}>
                                            ₹{salaryRange[0]}k
                                        </Text>{" "}
                                        -{" "}
                                        <Text size="md" fw={600} c="dark" style={{marginLeft: "4px", color: "#000000" }}>
                                            ₹{salaryRange[1]}k
                                        </Text>
                                    </div>
                                </div>
                                <RangeSlider
                                    value={salaryRange}
                                    onChange={setSalaryRange}
                                    min={0}
                                    max={500}
                                    step={5}
                                    styles={{
                                        track: { height: 2.5 },
                                        bar: { height: 2.5 }
                                    }}
                                    thumbSize={16}
                                    color="black"
                                    className="salary-slider"
                                />
                            </div>
                        </Grid.Col>
                    </Grid>
                </div>
            </div>

            {/* Main Content */}
            <MainContentSection jobType={jobType} location={location} title={title} salaryRange={salaryRange}
                                refresh={refresh}/>

            <CreateJobModal opened={opened} close={close} setRefetch={setRefresh}/>
        </div>
    )
}
