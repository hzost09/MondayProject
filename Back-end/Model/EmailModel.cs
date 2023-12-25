namespace Mondaycom2.Model
{
    public class EmailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public EmailModel(string to, string subject, string content)
        {
            Content = content;
            To = to;
            Subject = subject;
        }
    }
}

