import { NextResponse } from "next/server";

type ChatMessage = {
  id: string;
  conversationId: string;
  fromRole: "parent" | "instructor" | "student" | "support";
  toRole: "parent" | "instructor" | "student" | "support";
  fromName?: string;
  toName?: string;
  text: string;
  createdAt: string;
  attachmentName?: string;
};

type Conversation = {
  id: string;
  label: string;
  roles: { from: ChatMessage["fromRole"]; to: ChatMessage["toRole"] };
  time?: string;
  preview?: string;
  participants?: string[];
};

const RETENTION_DAYS = 30;

const contacts = [
  { id: "instructor-1", name: "Coach Alex", role: "instructor" },
  { id: "instructor-2", name: "Coach Jay", role: "instructor" },
  { id: "support-1", name: "Support", role: "support" },
  { id: "student-1", name: "Demo Student", role: "student" },
  { id: "parent-1", name: "Demo Parent", role: "parent" },
];

let conversations: Conversation[] = [
  {
    id: "c1",
    label: "Coach Alex (Instructor)",
    roles: { from: "instructor", to: "parent" },
    time: "2m ago",
    preview: "Hi! Great job...",
  },
  {
    id: "c2",
    label: "Support",
    roles: { from: "support", to: "parent" },
    time: "1h ago",
    preview: "Your free trial...",
  },
  {
    id: "c3",
    label: "Demo Student",
    roles: { from: "parent", to: "student" },
    time: "Yesterday",
    preview: "Family chat",
    participants: ["Demo Parent", "Demo Student"],
  },
];

let messages: ChatMessage[] = [
  {
    id: "m1",
    conversationId: "c1",
    fromRole: "instructor",
    toRole: "parent",
    fromName: "Coach Alex",
    text: "Hi! Great job on the last lesson. 👍",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    conversationId: "c1",
    fromRole: "parent",
    toRole: "instructor",
    fromName: "Parent",
    text: "Thanks! What should we do next?",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m3",
    conversationId: "c1",
    fromRole: "instructor",
    toRole: "parent",
    fromName: "Coach Alex",
    text: "Try the CSS Magic course next. Want me to assign it?",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m4",
    conversationId: "c2",
    fromRole: "support",
    toRole: "parent",
    fromName: "Support",
    text: "Your free trial has 7 days left.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m5",
    conversationId: "c3",
    fromRole: "parent",
    toRole: "student",
    fromName: "Demo Parent",
    toName: "Demo Student",
    text: "Let's review your HTML lesson tonight.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m6",
    conversationId: "c3",
    fromRole: "student",
    toRole: "parent",
    fromName: "Demo Student",
    toName: "Demo Parent",
    text: "Sure! I finished the quiz and can show you.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") as ChatMessage["fromRole"] | null;
  const q = searchParams.get("q")?.toLowerCase() || "";

  // prune messages older than retention window
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  messages = messages.filter((m) => new Date(m.createdAt).getTime() >= cutoff);

  const filteredMessages = role
    ? messages.filter((m) => m.fromRole === role || m.toRole === role)
    : messages;
  const convosForRole = role
    ? conversations.filter((c) => !c.roles || c.roles.from === role || c.roles.to === role)
    : conversations;
  const filteredConvos = q
    ? convosForRole.filter((c) => {
        const label = c.label.toLowerCase();
        const participants = (c.participants || []).join(" ").toLowerCase();
        return label.includes(q) || participants.includes(q);
      })
    : convosForRole;

  return NextResponse.json({ conversations: filteredConvos, messages: filteredMessages, contacts });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, fromRole, toRole, text, fromName, toName, participantNames, label, attachmentName } = body || {};

  if (action === "createConversation") {
    const participantList: string[] = Array.isArray(participantNames) ? participantNames : toName ? [toName] : [];
    const contact = contacts.find((c) => c.name === toName) || { name: toName || "New Contact", role: toRole };
    const convoLabel =
      label ||
      (participantList.length > 0 ? `Group: ${participantList.join(", ")}` : contact.name || "New Conversation");

    const convo: Conversation = {
      id: `c${conversations.length + 1}`,
      label: convoLabel,
      roles: { from: fromRole, to: (contact.role as any) || toRole },
      time: "Just now",
      preview: text || "",
      participants: participantList.length ? participantList : undefined,
    };
    conversations = [convo, ...conversations];
    if (text) {
      const msg: ChatMessage = {
        id: `m${messages.length + 1}`,
        conversationId: convo.id,
        fromRole,
        toRole: (contact.role as any) || toRole,
        fromName,
        toName: contact.name,
        text,
        createdAt: new Date().toISOString(),
        attachmentName,
      };
      messages = [...messages, msg];
    }
    return NextResponse.json({ conversation: convo, message: messages[messages.length - 1] });
  }

  if (!fromRole || !toRole || !text) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { conversationId } = body;
  const msg: ChatMessage = {
    id: `m${messages.length + 1}`,
    conversationId: conversationId ?? "c1",
    fromRole,
    toRole,
    fromName,
    toName,
    text,
    createdAt: new Date().toISOString(),
    attachmentName,
  };
  messages = [...messages, msg];
  // update preview/time
  conversations = conversations.map((c) =>
    c.id === msg.conversationId ? { ...c, preview: text || attachmentName || "Attachment", time: "Just now" } : c
  );
  return NextResponse.json({ message: msg });
}
