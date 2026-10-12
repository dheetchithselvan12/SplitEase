delimiter $$

create procedure usp_CreateExpense(
    in p_GroupId int,
    in p_Description varchar(255),
    in p_Amount decimal(10,2),
    in p_PaidByUserId int
)
begin
    insert into Expenses
    (
        GroupId,
        Description,
        Amount,
        PaidByUserId,
        CreatedAt
    )
    values
    (
        p_GroupId,
        p_Description,
        p_Amount,
        p_PaidByUserId,
        now()
    );

    select
        ExpenseId,
        GroupId,
        Description,
        Amount,
        PaidByUserId,
        CreatedAt
    from Expenses
    where ExpenseId = last_insert_id();

end $$

delimiter ;