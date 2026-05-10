import { readFile, readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  evaluateDegreeMap,
  type DegreeMapDoc,
} from "@/lib/evaluateDegree";
// Creates brace for easier evaluation
type requestBody = {
  sendingSchool?: string;
  major?: string;
  courses?: unknown;
};
// Finds exact match of files from data/json that match sendingschool, major 
async function findDegreeDocument(
  sendingSchool: string,
  major: string
): Promise<DegreeMapDoc | null> {
  // CWD is project route, DO NOT CHANGE OTHERWISE WONT WORK!!!!!
  const dataDir = path.join(process.cwd(), "data");
  let files: string[];
  try {
    files = await readdir(dataDir);
  } catch {
    return null;
  }

  for (const name of files) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = await readFile(path.join(dataDir, name), "utf-8");
      const doc = JSON.parse(raw) as DegreeMapDoc;
      // Match the fields of the file
      if (
        typeof doc.sendingSchool === "string" &&
        typeof doc.major === "string" &&
        doc.sendingSchool === sendingSchool &&
        doc.major === major
      ) {
        return doc;
      }
    } catch {
      // Used for possible malformed json files
      continue;
    }
  }
  return null;
}
// returns audit evals and accepts completed courses, school, and major
export async function POST(request: Request) {
  let requestBody: requestBody;
  try {
    requestBody = (await request.json()) as requestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON requestBody" }, { status: 400 });
  }

  const sendingSchool =
    typeof requestBody.sendingSchool === "string" ? requestBody.sendingSchool.trim() : "";
  // Only use course code as strings if numbers are involved, nothing else
  const major = typeof requestBody.major === "string" ? requestBody.major.trim() : "";
  const courses = Array.isArray(requestBody.courses)
    ? requestBody.courses.filter((c): c is string => typeof c === "string")
    : [];

  if (!sendingSchool || !major) {
    return NextResponse.json(
      { error: "sendingSchool and major are required" },
      { status: 400 }
    );
  }

  const doc = await findDegreeDocument(sendingSchool, major);
  if (!doc) {
    return NextResponse.json(
      { error: "No degree map found for that school and major" },
      { status: 404 }
    );
  }

  const evaluation = evaluateDegreeMap(doc, courses);
  return NextResponse.json(evaluation);
}
