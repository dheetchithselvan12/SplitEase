using System;
using System.Collections.Generic;

namespace SplitEase.Models;

public partial class Group
{
    public int GroupId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public virtual ICollection<Groupmember> Groupmembers { get; set; } = new List<Groupmember>();

    public virtual ICollection<Settlement> Settlements { get; set; } = new List<Settlement>();
}
