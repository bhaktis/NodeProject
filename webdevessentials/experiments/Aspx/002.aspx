<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

    protected void addBtn_Click(object sender, EventArgs e)
    {
        String a = ATb.Text;
        String b = ATb.Text;

        Double res = Convert.ToDouble(a) + Convert.ToDouble(b);
        CLbl.Text = res.ToString();
    }

    protected void subBtn_Click(object sender, EventArgs e)
    {
        String a = ATb.Text;
        String b = ATb.Text;

        Double res = Convert.ToDouble(a) - Convert.ToDouble(b);
        CLbl.Text = res.ToString();
    }

    protected void mulBtn_Click(object sender, EventArgs e)
    {
        String a = ATb.Text;
        String b = ATb.Text;

        Double res = Convert.ToDouble(a) * Convert.ToDouble(b);
        CLbl.Text = res.ToString();
    }

    protected void divBtn_Click(object sender, EventArgs e)
    {
        String a = ATb.Text;
        String b = ATb.Text;

        Double res = Convert.ToDouble(a) / Convert.ToDouble(b);
        CLbl.Text = res.ToString();
    }
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <h2>Calcultor using ASP.NET</h2>
    <div>
        <h3>About the experiment</h3>
        <p>
            This page will built a simple calculator using ASP.NET and c#. 
            Following function are added to calculator:
            1. Add
            2. Substract
            3. Multiply
            4. Divide                  
        </p>
     <h1>Simple Calculator</h1>
        A= <asp:TextBox ID="ATb" runat="server"></asp:TextBox> <br />
        B= <asp:TextBox ID="BTb" runat="server"></asp:TextBox><br /><br />
        C = <asp:Label ID="CLbl" runat="server"></asp:Label><br />

        <br />
        <asp:Button ID="addBtn" runat="server" Text="Add" onclick="addBtn_Click"/>
        <asp:Button ID="subBtn" runat="server" Text="Subtract" OnClick="subBtn_Click" />
        <asp:Button ID="mulBtn" runat="server" Text="Multiply" OnClick="mulBtn_Click" />
        <asp:Button ID="divBtn" runat="server" Text="Divide" OnClick="divBtn_Click" />
        <hr />
        <h3>Description</h3>
        <p>
            On entering the values of a and b and selecting the function to perform, the calculator 
            with return the result which will be displayed in the c.
        </p>
        <hr />
        <h3>Code snippet</h3>
        <p>function for division</p>
        <pre>
                                 protected void divBtn_Click(object sender, EventArgs e)
    {
        String a = ATb.Text;
        String b = ATb.Text;

        Double res = Convert.ToDouble(a) / Convert.ToDouble(b);
        CLbl.Text = res.ToString();
    }
         </pre>
        <hr />        
        <p><a href="https://github.com/bhaktis/Web-development-CS5610" target="_blank">GitHub Link </a></p>
        <hr />
        <h3>References</h3>
        <p><a href="https://www.youtube.com/user/jannunzi" target="_blank"> Prof. Jose's videos</a></p>
    </div>
    </form>
</body>
</html>
