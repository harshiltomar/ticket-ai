import { inngest } from "../client";
import User from "../../models/user";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const { email } = event.data;
            const user = await step.run("get-user-email", async () => {

                const userObject = await User.findOne({ email });
                if (!userObject) {
                    throw new NonRetriableError("User no longer exists in our database");
                }
                return userObject;

            })

            await step.run("send-welcome-email", async () => {
                const subject = `Welcome to the ticket system`;
                const text = `Dear User,\n\nWelcome to the ticket system! We're thrilled to have you on board. This is the first step towards a seamless ticketing experience. If you have any questions or need assistance, please don't hesitate to reach out.\n\nBest regards,\nThe Ticket System Team`;
                await sendEmail(user.email, subject, text);
            })
            
            return { success: true };
        } catch (error) {
            console.log("Error in onUserSignup", error.message);
            return { success: false };
        }
    }
)