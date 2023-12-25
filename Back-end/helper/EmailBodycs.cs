namespace Mondaycom2.helper
{
    public class EmailBodycs
    {
        public static string EmailStringBody(string email, string emailToken)
        {
            return $@"<html>
        <head></head>
        <body>
        <div>
            <h3>reset</h3>
        <a href=""http://localhost:4200/reset?email={email}&code={emailToken}"" target=""_blank"">ResetPassword</a>    
        </div>
        </body>
        </html>";
        }
    }
}
