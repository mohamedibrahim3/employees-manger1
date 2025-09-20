"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { updateEmployeeNotes, getEmployeeById } from "@/lib/actions/employee.actions";
import PrintButton from "@/components/PrintButton"; // 👈 زر الطباعة

const notesSchema = z.object({
  notes: z.string().optional(),
});

type NotesForm = z.infer<typeof notesSchema>;

const SecurityNotesPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [initialNotes, setInitialNotes] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<{
    name: string;
    nickName: string;
    administration: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<NotesForm>({
    resolver: zodResolver(notesSchema),
    defaultValues: { notes: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const notesRes = await fetch(`/api/employees/${id}/notes`);
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          setInitialNotes(notesData.notes || "");
          form.setValue("notes", notesData.notes || "");
        } else {
          const error = await notesRes.json();
          setError("خطأ في جلب الملاحظات: " + (error.error || "غير معروف"));
        }

        const employeeRes = await getEmployeeById(id);
        if (employeeRes.success && employeeRes.employee) {
          setEmployeeData({
            name: employeeRes.employee.name,
            nickName: employeeRes.employee.nickName,
            administration: employeeRes.employee.administration,
          });
        } else {
          setError("خطأ في جلب بيانات الموظف: " + (employeeRes.error || "غير معروف"));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, form]);

  const onSubmit = async (values: NotesForm) => {
    try {
      const result = await updateEmployeeNotes(id, values.notes || "");
      if (result.success) {
        toast("تم حفظ الملاحظات بنجاح");
        router.back();
      } else {
        toast("خطأ في الحفظ: " + (result.error || "غير معروف"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast("حدث خطأ");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="print-page min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header + زر الطباعة */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">
            الملاحظات الأمنية للموظف{employeeData ? `: ${employeeData.name}` : ""}
          </h1>
          <div className="mt-4 md:mt-0">
            <PrintButton className="bg-sky-600 hover:bg-sky-700">
              طباعة الصفحة
            </PrintButton>
          </div>
        </div>

        {employeeData && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-700">الاسم الفعلي: </span>
                <span className="text-gray-900">{employeeData.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">اسم الشهرة: </span>
                <span className="text-gray-900">{employeeData.nickName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">الإدارة: </span>
                <span className="text-gray-900">{employeeData.administration}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600">يمكنك تعديل الملاحظات الأمنية هنا، وسيتم حفظها تلقائياً مع الموظف.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">الملاحظات الأمنية</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-[85vh] w-full max-w-6xl resize-none text-xl leading-relaxed p-6"
                      placeholder="أدخل الملاحظات الأمنية هنا... (يمكن أن تكون تفصيلية)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4 justify-end print:hidden">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                رجوع
              </Button>
              <Button type="submit">حفظ التغييرات</Button>
            </div>
          </form>
        </Form>

        {initialNotes === "" && !form.watch("notes") && (
          <div className="text-center py-8 text-gray-500">
            <p>لا توجد ملاحظات أمنية مسجلة بعد. أضفها الآن!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityNotesPage;
