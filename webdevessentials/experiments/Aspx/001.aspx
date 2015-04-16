<%@ Page Language="C#" AutoEventWireup="true" CodeFile="001.aspx.cs" Inherits="experiments_Aspx_001" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"/>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
   
</head>
<body>
    <form id="form1" runat="server">
    <div class="container">
    <h1>Embedding C#</h1><br />
        <ul>
        <%
            string[] titles = {"Java", "C#","NodeJS"};
            double[] price = { 123, 234, 345 };
             %>

             </ul>
        <table class="table table-stripped">
             <tr>
                <th>CourseTitle</th>
                <th>Course Price</th>
            </tr>
           <% for(var i=0; i<titles.Length;i++) { %>   
            <tr>
                <td><%= titles[i] %></td>
                <td>$<%= price[i] %></td>
            </tr>
            <%} %>
        </table>
    </div>
    </form>
</body>
</html>
