import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const filter = [];
    const values = [];

    if (searchParams.get("jobType")) {
        values.push(`%${searchParams.get("jobType")}%`);
        filter.push(`job_type ILIKE $${values.length}`);
    }

    if (searchParams.get("jobTitle")) {
        values.push(`%${searchParams.get("jobTitle")}%`);
        filter.push(`job_title ILIKE $${values.length}`);
    }

    if (searchParams.get("location")) {
        values.push(`%${searchParams.get("location")}%`);
        filter.push(`location ILIKE $${values.length}`);
    }

    if (searchParams.get("minSalary") && searchParams.get("maxSalary")) {
        values.push(Number(searchParams.get("minSalary")));
        values.push(Number(searchParams.get("maxSalary")));
        filter.push(`max_salary BETWEEN $${values.length - 1} AND $${values.length}`);
    } else if (searchParams.get("minSalary")) {
        values.push(Number(searchParams.get("minSalary")));
        filter.push(`max_salary >= $${values.length}`);
    } else if (searchParams.get("maxSalary")) {
        values.push(Number(searchParams.get("maxSalary")));
        filter.push(`max_salary <= $${values.length}`);
    }

    const whereClause = filter.length > 0 ? `WHERE ${filter.join(" AND ")}` : "";

    console.log(whereClause, values);
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC`, values);
        return NextResponse.json(res.rows);
    } finally {
        client.release();
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const client = await pool.connect();

    try {
        const {
            companyName,
            jobTitle,
            location,
            minSalary,
            maxSalary,
            jobType,
            deadLine,
            description,
        } = body;

        // Basic input validation
        if (
            !companyName ||
            !jobTitle ||
            !location ||
            minSalary === undefined ||
            maxSalary === undefined ||
            !jobType ||
            !deadLine ||
            !description
        ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (typeof minSalary !== "number" || typeof maxSalary !== "number") {
            return NextResponse.json({ error: "Salary fields must be numbers" }, { status: 400 });
        }

        if (minSalary < 0 || maxSalary < 0) {
            return NextResponse.json({ error: "Salary fields must be non-negative" }, { status: 400 });
        }

        if (minSalary > maxSalary) {
            return NextResponse.json({ error: "minSalary cannot be greater than maxSalary" }, { status: 400 });
        }

        const res = await client.query(
            `INSERT INTO jobs 
                        (company_name, job_title, location, min_salary, max_salary, job_type, deadLine, description)
             VALUES
                        ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                companyName,
                jobTitle,
                location,
                minSalary,
                maxSalary,
                jobType,
                deadLine,
                description,
            ]
        );

        return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error inserting job:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}
