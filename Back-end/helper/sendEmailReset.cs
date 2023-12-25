using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Mondaycom2.Model;

namespace Mondaycom2.helper
{
    public class sendEmailReset : IsendEmailReset
    {
        private readonly IConfiguration _config;

        public sendEmailReset(IConfiguration config)
        {
            _config = config;
        }

        public void sendMail(EmailModel email)
        {
           var emailmess = new  MimeMessage();
            var from = _config["EmailSetting:From"];
            var name = _config["EmailSetting:UserName"];
            emailmess.From.Add(new MailboxAddress(name, from));
            emailmess.To.Add(new MailboxAddress(email.To,email.To));
            emailmess.Subject = email.Subject;
            emailmess.Body = new TextPart(MimeKit.Text.TextFormat.Html) { 
                    Text = string.Format(email.Content)
            };
            using (var client = new SmtpClient())
            {
                try 
                {
                    //với cổng 587 => smtp.ethereal.email
                    client.Connect(_config["EmailSetting:SmtpServe"], 587, SecureSocketOptions.StartTls);
                    client.Authenticate(_config["EmailSetting:From"], _config["EmailSetting:Password"]);
                    client.Send(emailmess);
                }
                catch 
                {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }

        }
    }
}
