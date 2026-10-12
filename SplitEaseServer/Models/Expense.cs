using System;
using System.Collections.Generic;

namespace SplitEase.Models;

public partial class Expense
{
    public int ExpenseId { get; set; }

    public int GroupId { get; set; }

    public string Description { get; set; } = null!;

    public decimal Amount { get; set; }

    public int PaidByUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Expenseparticipant> Expenseparticipants { get; set; } = new List<Expenseparticipant>();

    public virtual Group Group { get; set; } = null!;

    public virtual User PaidByUser { get; set; } = null!;
}
