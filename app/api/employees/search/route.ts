import { getEmployeesBySearch } from "@/lib/actions/employee.actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const administration = searchParams.get("administration") || "";

    const result = await getEmployeesBySearch(name, administration);

    return NextResponse.json(
      {
        success: true,
        employees: result?.employees || result || []
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء البحث", employees: [] },
      { status: 500 }
    );
  }
}
