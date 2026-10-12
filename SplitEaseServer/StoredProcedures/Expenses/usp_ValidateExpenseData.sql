delimiter $$

create procedure usp_ValidateExpenseData(
    in p_GroupId int,
    in p_PaidByUserId int
)

begin
select
    exists(
        select 1
        from `Groups`
        where GroupId = p_GroupId
    ) as GroupExists,

    exists(
        select 1
        from GroupMembers
        where GroupId = p_GroupId
          and UserId = p_PaidByUserId
    ) as PayerIsMember;

end $$

delimiter ;