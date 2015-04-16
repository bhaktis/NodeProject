<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        experiments.Item shoes = new experiments.Item("Shoes",DateTime.Today,300);
        experiments.Item dress = new experiments.Item("Dresses", DateTime.Today,500);
        experiments.Item books = new experiments.Item("Books", DateTime.Today,200);

        List<experiments.Item> cart = new List<experiments.Item>();
        cart.Add(shoes);
        cart.Add(dress);
        cart.Add(books);        
        
        if(Session["cart"] == null)
            Session["cart"] = cart;     
     }
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"/>
     <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
   
</head>
<body>
    <form id="form1" runat="server">
         <h2>List and data in ASP.NET</h2>

    <div>
         <h3>About the experiment</h3>
        <p>
            This experiment will explain how to store data objects and retrieve them in asp.net. 
            The data in stored by creating class objects in code behind under namespace.                            
        </p>
        <h3>Description</h3>
                <p>
                   We have created a Item class in the server which maintains data about donatable items. 
                    like description, quantity and data it was donated.
                    This is retireved in the aspx page load function and set in the session . 
                    Later the list is renderend as table.
                </p>
        <hr />
    <h1>Donatable Items</h1>
        
        <table class="table table-stripped">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <%  List<experiments.Item> cart = (List<experiments.Item>)Session["cart"];
                    for (var i = 0; i < cart.Count; i++)
                    {
                        experiments.Item item = cart.ElementAt(i); %>
                <tr>
                    <td>
                        <%=item.description %>
                    </td>
                    <td>
                        <%=item.quantity %>
                    </td>
                    <td>
                        <%=item.date %>
                    </td>
                </tr>
                <%} %>
            </tbody>
        </table>

        <hr />        
        <p><a href="https://github.com/bhaktis/Web-development-CS5610" target="_blank">GitHub Link </a></p>
        <hr />
        <h3>References</h3>
        <p><a href="https://www.youtube.com/user/jannunzi" target="_blank"> Prof. Jose's videos</a></p> 
    </div>
    </form>
</body>
</html>
