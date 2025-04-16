"use client";

import { useState } from "react";
// @ts-ignore
import { useForm } from "react-hook-form";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "نام باید حداقل ۲ کاراکتر باشد",
  }),
  email: z.string().email({
    message: "لطفا یک ایمیل معتبر وارد کنید",
  }),
  phone: z
    .string()
    .min(11, {
      message: "شماره موبایل باید ۱۱ رقم باشد",
    })
    .max(11),
});

const academyFormSchema = z.object({
  academyName: z.string().min(2, {
    message: "نام آکادمی باید حداقل ۲ کاراکتر باشد",
  }),
  address: z.string().min(5, {
    message: "آدرس باید حداقل ۵ کاراکتر باشد",
  }),
  phone: z.string().min(8, {
    message: "شماره تلفن باید حداقل ۸ رقم باشد",
  }),
  logo: z.string().optional(),
});

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
    }),
    newPassword: z.string().min(6, {
      message: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد",
    }),
    confirmPassword: z.string().min(6, {
      message: "تایید رمز عبور باید حداقل ۶ کاراکتر باشد",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تایید آن باید یکسان باشند",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const academyForm = useForm<z.infer<typeof academyFormSchema>>({
    resolver: zodResolver(academyFormSchema),
    defaultValues: {
      academyName: "",
      address: "",
      phone: "",
      logo: "",
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // در یک پروژه واقعی، اطلاعات باید از سرور/دیتابیس دریافت شود
  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    try {
      // اینجا اطلاعات پروفایل را ذخیره می‌کنیم
      // const { error } = await supabase.from('profiles').update({ ...values })

      // برای نمایش مثال
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error("خطا در به‌روزرسانی اطلاعات پروفایل");
    } finally {
      setIsLoading(false);
    }
  }

  async function onAcademySubmit(values: z.infer<typeof academyFormSchema>) {
    setIsLoading(true);
    try {
      // اینجا اطلاعات آکادمی را ذخیره می‌کنیم
      // const { error } = await supabase.from('academy_settings').update({ ...values })

      // برای نمایش مثال
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("اطلاعات آکادمی با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error("خطا در به‌روزرسانی اطلاعات آکادمی");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    setIsLoading(true);
    try {
      // اینجا رمز عبور را تغییر می‌دهیم
      // const { error } = await supabase.auth.updateUser({ password: values.newPassword })

      // برای نمایش مثال
      await new Promise((resolve) => setTimeout(resolve, 1000));

      securityForm.reset();
      toast.success("رمز عبور با موفقیت تغییر کرد");
    } catch (error) {
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">تنظیمات</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">اطلاعات کاربری</TabsTrigger>
          <TabsTrigger value="academy">تنظیمات آکادمی</TabsTrigger>
          <TabsTrigger value="security">امنیت و رمز عبور</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شخصی</CardTitle>
              <CardDescription>اطلاعات شخصی خود را ویرایش کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={
                        // @ts-ignore
                        ({ field }) => (
                          <FormItem>
                            <FormLabel>نام و نام خانوادگی</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="نام و نام خانوادگی"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={
                        // @ts-ignore
                        ({ field }) => (
                          <FormItem>
                            <FormLabel>ایمیل</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="example@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={
                        // @ts-ignore
                        ({ field }) => (
                          <FormItem>
                            <FormLabel>شماره موبایل</FormLabel>
                            <FormControl>
                              <Input placeholder="09123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }
                    />
                  </div>

                  <CardFooter className="px-0 pb-0">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academy">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات آکادمی</CardTitle>
              <CardDescription>
                اطلاعات آکادمی خود را تنظیم کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...academyForm}>
                <form
                  onSubmit={academyForm.handleSubmit(onAcademySubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={academyForm.control}
                    name="academyName"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>نام آکادمی</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="آکادمی فوتبال ستارگان"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <FormField
                    control={academyForm.control}
                    name="address"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>آدرس</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="آدرس کامل آکادمی"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <FormField
                    control={academyForm.control}
                    name="phone"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>شماره تماس</FormLabel>
                          <FormControl>
                            <Input placeholder="021-12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <FormField
                    control={academyForm.control}
                    name="logo"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>آدرس لوگو</FormLabel>
                          <FormControl>
                            <Input placeholder="آدرس URL لوگو" {...field} />
                          </FormControl>
                          <FormDescription>
                            آدرس URL تصویر لوگوی آکادمی را وارد کنید
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <CardFooter className="px-0 pb-0">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>امنیت و رمز عبور</CardTitle>
              <CardDescription>تغییر رمز عبور و تنظیمات امنیتی</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>رمز عبور فعلی</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>رمز عبور جدید</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            رمز عبور باید حداقل ۶ کاراکتر باشد
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={
                      // @ts-ignore
                      ({ field }) => (
                        <FormItem>
                          <FormLabel>تایید رمز عبور جدید</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }
                  />

                  <CardFooter className="px-0 pb-0">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "تغییر رمز عبور"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
