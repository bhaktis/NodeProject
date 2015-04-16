<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {     
        if (Session["message"] != null)
            messageLbl.Text = Session["message"].ToString();
        else
            messageLbl.Text = "";            
    }

    protected void rememberBtn_Click(object sender, EventArgs e)
    {
        if (Session["message"] == null)
        {
            Session["message"] = messageTb.Text;
            messageLbl.Text = Session["message"].ToString();
        }            
    }

    protected void forgetBtn_Click(object sender, EventArgs e)
    {
        Session.Remove("message");
    }
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../css/bootstrap.min.css" />
</head>
<body>
    <form id="form1" runat="server">
        <h2>Maintaining session in ASP.NET</h2>
    <div>
         <h3>About the experiment</h3>
        <p>
            This experiment will explain session in asp.net.
            We will show how to add data to session, retrieve data and delete data from the session.                 
        </p>
        <h3>Description</h3>
                <p>
                   The session in ASP.NET can be maintained using following functions<br />
                    Add: session["objectName"] = object;<br />
                    Delete : Session.Remove("objName");<br />
                    The asp.net remember the session on setting it and can be retrieved at any time.

                </p>
        <hr />
    <h1>Session</h1>
        <br />
        <asp:TextBox ID="messageTb" runat="server"></asp:TextBox>
        <br />
        <asp:Button ID="rememberBtn" runat="server" Text="Remember" OnClick="rememberBtn_Click" />
        <asp:Button ID="forgetBtn" runat="server" Text="Forget" OnClick="forgetBtn_Click" /><br />
        <asp:label ID="messageLbl" runat="server"></asp:label>     
        <hr />        
        <p><a href="https://github.com/bhaktis/Web-development-CS5610" target="_blank">GitHub Link </a></p>
        <hr />
        <h3>References</h3>
        <p><a href="https://www.youtube.com/user/jannunzi" target="_blank"> Prof. Jose's videos</a></p>   
    </div>
    </form>
</body>
</html>
