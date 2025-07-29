import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InviteUserProps {
  username?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  inviteLink?: string;
}

export const InviteUser = ({
  username,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: InviteUserProps) => {
  const previewText = `Join ${invitedByUsername} on Employee Rating`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={
                  "https://firebasestorage.googleapis.com/v0/b/host-media-862d8.appspot.com/o/logo.jpg?alt=media&token=b361445c-309e-4b40-aead-4049a7b3c75b"
                }
                width="40"
                height="37"
                alt="Employee Rating Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{teamName}</strong> on{" "}
              <strong>Employee Rating</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on{" "}
              <strong>Employee Rating</strong>.
            </Text>
            <Section>
              <Text className="text-[14px] leading-[24px] text-gray-800">
                Your Growth Matters with <strong>{teamName}</strong> We&apos;re
                excited to provide you with personalized feedback through{" "}
                {teamName} on
                <strong>Employee Rating</strong>. Join the team to view your
                ratings, gain insights, and take the next step in your career
                journey. Let&apos;s grow together!
              </Text>
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-gray-950 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[12px] leading-[20px] text-gray-800">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>. This invite was
              sent from <span className="text-black">Employee Rating</span>. If
              you were not expecting this invitation, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InviteUser;
