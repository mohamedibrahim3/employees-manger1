import { getEmployeeById } from "@/lib/actions/employee.actions";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { formateHiringType, formateMaritalStatus } from "@/lib/utils";
import EmployeeImages from "@/components/EmployeeImages";
import PrintButton from "@/components/PrintButton";

const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "بيانات الأب",
  mother: "بيانات الأم",
  spouse: "بيانات الزوج/الزوجة",
  son: "بيانات الابن",
  daughter: "بيانات الابنة",
  brother: "بيانات الأخ",
  sister: "بيانات الأخت",
};

const EmployeeDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  noStore();
  const { id } = await props.params;

  const result = await getEmployeeById(id);

  if (!result.success || !result.employee) {
    return (
      <div className="min-h-screen bg-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600">الموظف غير موجود</h1>
          <p className="text-gray-600 mt-2">
            لا يمكن العثور على الموظف المطلوب.
          </p>
        </div>
      </div>
    );
  }

  const { employee } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-6 space-y-6 max-w-6xl print:max-w-full">

        {/* Header */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-lg shadow-sm print:hidden">
  <div className="mb-4 md:mb-0">
    <h1 className="text-3xl font-bold text-gray-900">تفاصيل الموظف</h1>
    <p className="text-gray-600 mt-1">عرض بيانات الموظف في المؤسسة</p>
  </div>
  <div className="print:hidden flex flex-wrap gap-4">
    <PrintButton className="bg-sky-600 hover:bg-sky-700">
      طباعة الصفحة
    </PrintButton>
    <Link
      href={`/employees/${id}/security-notes`}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
    >
      الملاحظات الأمنية
    </Link>
    <Link
      href="/employees"
      className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
    >
      العودة إلى قائمة الموظفين
    </Link>
  </div>
</div>


         {/* Photos Section */}
        {(employee.personalImageUrl ||
          employee.idFrontImageUrl ||
          employee.idBackImageUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                صور ووثائق الموظف
              </CardTitle>
              <CardDescription>الصورة الشخصية وصورة البطاقة الشخصية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-8 justify-center">
                {employee.personalImageUrl && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">الصورة الشخصية</h4>
                    <img
                      src={employee.personalImageUrl}
                      alt={`صورة ${employee.name}`}
                      className="w-44 h-56 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
                {employee.idFrontImageUrl && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">وجه البطاقة</h4>
                    <img
                    src={employee.idFrontImageUrl}
                    alt="وجه البطاقة"
                    className="w-72 h-52 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                    </div>
                  )}
{employee.idBackImageUrl && (
  <div className="text-center">
    <h4 className="text-sm font-medium mb-3 text-gray-700">ظهر البطاقة</h4>
    <img
      src={employee.idBackImageUrl}
      alt="ظهر البطاقة"
      className="w-72 h-52 object-cover rounded-lg border-2 border-gray-200 shadow-md"
    />
  </div>
)}

              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
          {/* Personal Information Table */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-800 bg-gray-100 p-3 rounded-t">
              المعلومات الشخصية
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-base">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 w-1/3 border-r border-gray-300">الاسم الكامل</td>
                  <td className="p-3">{employee.name}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">اسم الشهرة</td>
                  <td className="p-3">{employee.nickName}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">رقم البطاقة</td>
                  <td className="p-3">{employee.nationalId}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">المهنة</td>
                  <td className="p-3">{employee.profession}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">تاريخ الميلاد</td>
                  <td className="p-3">{new Date(employee.birthDate).toLocaleDateString("ar-SA")}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">الحالة الاجتماعية</td>
                  <td className="p-3">{formateMaritalStatus(employee.maritalStatus)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">رقم الهاتف</td>
                  <td className="p-3">{employee.phoneNumber}</td>
                </tr>
                {employee.email && (
                  <tr className="border-b border-gray-300">
                    <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">البريد الإلكتروني</td>
                    <td className="p-3">{employee.email}</td>
                  </tr>
                )}
                <tr>
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">العنوان التفصيلي</td>
                  <td className="p-3">{employee.residenceLocation}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Work Information Table */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-800 bg-gray-100 p-3 rounded-t">
              المعلومات الوظيفية
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-base mb-6">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 w-1/3 border-r border-gray-300">الإدارة</td>
                  <td className="p-3">{employee.administration}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">العمل الفعلي</td>
                  <td className="p-3">{employee.actualWork}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">تاريخ التعيين</td>
                  <td className="p-3">{new Date(employee.hiringDate).toLocaleDateString("ar-SA")}</td>
                </tr>
                <tr>
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">نوع التعيين</td>
                  <td className="p-3">{formateHiringType(employee.hiringType)}</td>
                </tr>
              </tbody>
            </table>

            {/* System Information Table */}
            <h2 className="text-xl font-bold mb-3 text-gray-800 bg-gray-100 p-3 rounded-t">
              معلومات النظام
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-base">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 font-semibold p-3 w-1/3 border-r border-gray-300">تاريخ الإنشاء</td>
                  <td className="p-3">{new Date(employee.createdAt).toLocaleDateString("ar-SA")}</td>
                </tr>
                <tr>
                  <td className="bg-gray-50 font-semibold p-3 border-r border-gray-300">آخر تحديث</td>
                  <td className="p-3">{new Date(employee.updatedAt).toLocaleDateString("ar-SA")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Family Relationships Table */}
        {employee.relationships && employee.relationships.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3 text-gray-800 bg-gray-100 p-3 rounded-t">
              العلاقات العائلية
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-3 text-center font-semibold">نوع القرابة</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">الاسم</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">رقم البطاقة</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">تاريخ الميلاد</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">مكان الميلاد</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">المهنة</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">محل الإقامة</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.relationships.map((relationship: any, index: number) => (
                    <tr key={relationship.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 p-3 text-center font-medium">
                        {RELATIONSHIP_LABELS[relationship.relationshipType] || relationship.relationshipType}
                      </td>
                      <td className="border border-gray-300 p-3">{relationship.name}</td>
                      <td className="border border-gray-300 p-3 text-center">{relationship.nationalId}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        {new Date(relationship.birthDate).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="border border-gray-300 p-3">{relationship.birthPlace || "-"}</td>
                      <td className="border border-gray-300 p-3">{relationship.profession || "-"}</td>
                      <td className="border border-gray-300 p-3">{relationship.residenceLocation}</td>
                      <td className="border border-gray-300 p-3">{relationship.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Relationships Message */}
        {(!employee.relationships || employee.relationships.length === 0) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3 text-gray-800 bg-gray-100 p-3 rounded-t">
              العلاقات العائلية
            </h2>
            <div className="border border-gray-300 p-8 text-center bg-gray-50">
              <p className="text-gray-500 text-base">لا توجد علاقات عائلية مسجلة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;