import { readdir, readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export type DegreeProgramEntry = {
  sendingSchool: string;
  major: string;
};
// Scans  degree program from data/json files
// Stores sendingschool, major, ect
export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  let files: string[];
  try {
    files = await readdir(dataDir);
  } catch {
    // Sends 200 in bad request, notify frontend for fix
    return NextResponse.json({ programs: [] as DegreeProgramEntry[] });
  }

  const programs: DegreeProgramEntry[] = [];
  for (const name of files) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = await readFile(path.join(dataDir, name), "utf-8");
      const doc = JSON.parse(raw) as {
        sendingSchool?: unknown;
        major?: unknown;
      };
      const sendingSchool =
        typeof doc.sendingSchool === "string" ? doc.sendingSchool.trim() : "";
      const major = typeof doc.major === "string" ? doc.major.trim() : "";
      if (sendingSchool && major) {
        programs.push({ sendingSchool, major });
      }
    } catch {
      // Resolves any errors, nothing returned
    }
  }

  return NextResponse.json({ programs });
}
