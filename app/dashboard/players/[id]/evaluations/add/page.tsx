"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowRight } from "lucide-react";
import { players } from "@/app/data";

interface Player {
  id: string;
  name: string;
}

const formSchema = z.object({
  passing: z.number().min(1).max(10),
  shooting: z.number().min(1).max(10),
  dribbling: z.number().min(1).max(10),
  technique: z.number().min(1).max(10),
  tactical: z.number().min(1).max(10),
  physical: z.number().min(1).max(10),
  speed: z.number().min(1).max(10),
  aerial: z.number().min(1).max(10),
  defending: z.number().min(1).max(10),
  personality: z.number().min(1).max(10),
  evaluation_date: z.string(),
  notes: z.string().optional(),
});

export function generateStaticParams() {
  return players.map(player => ({
    id: player.id,
  }));
}

export default function AddEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;
  const supabase = createClientComponentClient();

  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passing: 5,
      shooting: 5,
      dribbling: 5,
      technique: 5,
      tactical: 5,
      physical: 5,
      speed: 5,
      aerial: 5,
      defending: 5,
      personality: 5,
      evaluation_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    async function fetchPlayer() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("players")
          .select("id, name")
          .eq("id", playerId)
          .single();

        if (error) throw error;

        setPlayer(data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات بازیکن:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("evaluations").insert([
        {
          player_id: playerId,
          ...values,
        },
      ]);

      if (error) {
        throw error;
      }

      router.push(`/dashboard/players/${playerId}`);
      router.refresh();
    } catch (error) {
      console.error("خطا در ثبت ارزیابی:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">بازیکن مورد نظر یافت نشد!</p>
        <Button onClick={() => router.push("/dashboard/players")}>
          بازگشت به لیست بازیکنان
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/players/${playerId}`)}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت
        </Button>
        <h1 className="text-3xl font-bold">ثبت ارزیابی جدید: {player.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ارزیابی مهارت‌های فنی</CardTitle>
          <CardDescription>
            لطفا مهارت‌های بازیکن را با امتیاز ۱ تا ۱۰ ارزیابی کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="passing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مهارت پاس</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        توانایی ارسال پاس‌های دقیق کوتاه و بلند
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shooting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مهارت شوت‌زنی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        دقت، قدرت و تکنیک شوت‌زنی
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dribbling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مهارت دریبل</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        کنترل توپ و توانایی عبور از مدافعان
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تکنیک فردی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        مهارت‌های فنی پایه و استفاده از هر دو پا
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tactical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>هوش تاکتیکی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        درک بازی، موقعیت‌یابی و تصمیم‌گیری
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="physical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قدرت بدنی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        استقامت و قدرت در نبردهای تن به تن
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="speed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سرعت</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>سرعت دویدن و عکس‌العمل</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aerial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قدرت هوایی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        توانایی در نبردهای هوایی و ضربات سر
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defending"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مهارت دفاعی</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        توانایی دفاع کردن و قطع توپ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شخصیت و روحیه</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xs">
                                {i + 1}
                              </span>
                            ))}
                          </div>
                          <div className="text-center font-medium">
                            {field.value}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        رهبری، انگیزه و روحیه تیمی
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="evaluation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاریخ ارزیابی</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>یادداشت مربی</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="نظرات و توصیه‌های خود را بنویسید"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      نقاط قوت، ضعف و توصیه‌های بهبود برای بازیکن را ذکر کنید
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 pb-0">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ثبت..." : "ثبت ارزیابی"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
