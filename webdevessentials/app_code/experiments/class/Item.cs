using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace experiments
{
    public class Item
    {
        public int quantity { set; get; }
        public DateTime date { set; get; }
        public string description { set; get; }

        public Item(string description, DateTime date, int quantity)
        {
            this.description = description;
            this.date = date;
            this.quantity = quantity;
        }
    }
}
