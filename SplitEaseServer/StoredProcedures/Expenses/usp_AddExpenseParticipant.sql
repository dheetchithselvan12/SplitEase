delimiter $$

create procedure usp_AddExpenseParticipant(
    in p_ExpenseId int,
    in p_UserId int,
    in p_ShareAmount decimal(10,2),
    in p_NetAmount decimal(10,2)
)
begin
    insert into ExpenseParticipants
    (
        ExpenseId,
        UserId,
        ShareAmount,
        NetAmount
    )
    values 
    (
    p_ExpenseId,
    p_UserId,
    p_ShareAmount,
    p_NetAmount
    );
    
end $$

delimiter ;