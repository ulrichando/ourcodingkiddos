"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Sparkles, Camera, X, ChevronLeft, ChevronRight, Gamepad2, Globe, Smartphone, Cpu, Brain, Palette, Eye, Ear, Hand, BookOpen } from "lucide-react";
import Button from "../../../../components/ui/button";
import { useSession } from "next-auth/react";

const avatars = ["🦊", "🐼", "🦁", "🐯", "🐸", "🦉", "🐙", "🦄", "🐲", "🤖", "👾", "🎮"];
const ageOptions = ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

const codingInterests = [
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "websites", label: "Websites", icon: Globe },
  { id: "apps", label: "Apps", icon: Smartphone },
  { id: "robotics", label: "Robotics", icon: Cpu },
  { id: "ai", label: "AI", icon: Brain },
  { id: "animation", label: "Animation", icon: Palette },
];

const learningStyles = [
  { id: "visual", label: "Visual", description: "Learns best with images and diagrams", icon: Eye },
  { id: "auditory", label: "Auditory", description: "Learns best by listening", icon: Ear },
  { id: "kinesthetic", label: "Kinesthetic", description: "Learns best by doing", icon: Hand },
  { id: "reading", label: "Reading/Writing", description: "Learns best with text", icon: BookOpen },
];

export default function AddStudentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step management
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Profile fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [useCustomImage, setUseCustomImage] = useState(false);

  // Preferences fields
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [parentNotes, setParentNotes] = useState("");

  // Accessibility fields
  const [accessibility, setAccessibility] = useState({
    dyslexia_font: false,
    high_contrast: false,
    larger_text: false,
    reduce_motion: false,
    screen_reader: false,
    keyboard_navigation: false,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ageGroup = age ? (Number(age) <= 10 ? "AGES_7_10" : Number(age) <= 14 ? "AGES_11_14" : "AGES_15_18") : null;
  const progress = (step / totalSteps) * 100;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      setUseCustomImage(true);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setUseCustomImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canProceedStep1 = name && username && password && age;
  const canProceedStep2 = true; // Optional fields
  const canSubmit = canProceedStep1;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          username,
          password,
          email: email.trim().toLowerCase() || undefined,
          age: Number(age),
          birthday: birthday || undefined,
          ageGroup,
          avatar: useCustomImage ? null : avatar,
          profileImage: useCustomImage ? profileImage : null,
          parentEmail: session?.user?.email ?? "",
          codingInterests: selectedInterests,
          learningStyle: learningStyle || undefined,
          learningGoals: learningGoals || undefined,
          parentNotes: parentNotes || undefined,
          accessibility,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Could not create student");
      const creds = json?.credentials;
      const loginMethod = creds?.email && !creds.email.includes("@students.ourcodingkiddos.com")
        ? `Email: ${creds.email}`
        : `Username: ${creds?.username}`;
      setSuccess(
        creds
          ? `Student created! ${loginMethod} • Password: ${creds.password}`
          : "Student account created successfully!"
      );
      setTimeout(() => router.push("/dashboard/parent"), 1500);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7ecff,_#ffffff_45%)] dark:bg-[radial-gradient(circle_at_top,_#1e1b4b,_#0f172a_45%)] flex items-start justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-4xl">
        <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-lg">
                <User className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add a New Student</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {step === 1 && "Create a profile for your child"}
                {step === 2 && "Customize learning preferences"}
                {step === 3 && "Set accessibility options"}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500" : "w-2 bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Profile Information */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Profile Picture</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                      {useCustomImage && profileImage ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-700 shadow-lg">
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          <button
                            onClick={removeProfileImage}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-5xl border-4 border-purple-200 dark:border-purple-700 shadow-lg">
                          {avatar}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar Selection (only if not using custom image) */}
                {!useCustomImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Or Choose an Avatar</p>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                      {avatars.map((av) => {
                        const active = av === avatar;
                        return (
                          <button
                            key={av}
                            onClick={() => setAvatar(av)}
                            className={`h-12 w-12 rounded-xl border flex items-center justify-center text-2xl transition-all ${
                              active ? "border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-[0_0_0_3px_rgba(168,85,247,0.3)] scale-110" : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:scale-105"
                            }`}
                            aria-label={`Select avatar ${av}`}
                          >
                            {av}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1 sm:col-span-2">
                    Student&apos;s First Name *
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter first name"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1">
                    Username (for login) *
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g., emma2024"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1">
                    Password *
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g., coder123"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1 sm:col-span-2">
                    Email (Optional)
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="child@example.com"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400"
                    />
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                      If your child has their own email, they can use it to login. Otherwise, they&apos;ll use their username.
                    </p>
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1">
                    Age *
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select age</option>
                      {ageOptions.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1">
                    Birthday (Optional)
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                    />
                  </label>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <strong>Note:</strong> Share the username and password with your child to access their student portal.
                </p>
              </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Coding Interests */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Coding Interests (Optional)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select what your child is interested in learning</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {codingInterests.map((interest) => {
                      const Icon = interest.icon;
                      const selected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selected
                              ? "border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-lg"
                              : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-purple-200 dark:hover:border-purple-700"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-1 ${selected ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"}`} />
                          <p className={`text-xs font-medium ${selected ? "text-purple-900 dark:text-purple-100" : "text-slate-700 dark:text-slate-300"}`}>
                            {interest.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Learning Style */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Learning Style (Optional)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">How does your child learn best?</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {learningStyles.map((style) => {
                      const Icon = style.icon;
                      const selected = learningStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setLearningStyle(style.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selected
                              ? "border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-lg"
                              : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-purple-200 dark:hover:border-purple-700"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selected ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"}`} />
                            <div>
                              <p className={`text-sm font-medium ${selected ? "text-purple-900 dark:text-purple-100" : "text-slate-700 dark:text-slate-300"}`}>
                                {style.label}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{style.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Learning Goals */}
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1 block">
                  Learning Goals (Optional)
                  <textarea
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    placeholder="What would you like your child to achieve? (e.g., build their first game, understand web development basics)"
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400 resize-none"
                  />
                </label>

                {/* Parent Notes */}
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 space-y-1 block">
                  Parent Notes (Private, Optional)
                  <textarea
                    value={parentNotes}
                    onChange={(e) => setParentNotes(e.target.value)}
                    placeholder="Any additional information about your child's learning needs or preferences..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 dark:placeholder:text-slate-400 resize-none"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">These notes are only visible to you</p>
                </label>
              </div>
            )}

            {/* Step 3: Accessibility */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  Enable features to make learning more accessible for your child
                </p>
                {[
                  { key: "dyslexia_font", label: "Dyslexia-friendly font", desc: "Uses OpenDyslexic font for easier reading" },
                  { key: "high_contrast", label: "High contrast mode", desc: "Increases color contrast for better visibility" },
                  { key: "larger_text", label: "Larger text", desc: "Increases font size throughout the interface" },
                  { key: "reduce_motion", label: "Reduce motion", desc: "Minimizes animations and transitions" },
                  { key: "screen_reader", label: "Screen reader support", desc: "Enhanced compatibility with screen readers" },
                  { key: "keyboard_navigation", label: "Keyboard navigation", desc: "Improved keyboard-only navigation" },
                ].map((opt) => {
                  const isChecked = (accessibility as any)[opt.key];
                  return (
                    <div key={opt.key} className="flex items-center justify-between border-b last:border-b-0 border-slate-100 dark:border-slate-700 py-3">
                      <div className="flex-1 pr-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opt.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={(e) => setAccessibility((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                        />
                        <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${
                          isChecked
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-slate-200 dark:bg-slate-600"
                        }`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">{success}</p>}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !canProceedStep1}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Creating..." : "Add Student"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
