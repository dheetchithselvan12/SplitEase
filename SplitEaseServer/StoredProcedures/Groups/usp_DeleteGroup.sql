delimiter $$

create procedure usp_DeleteGroup(
    in p_GroupId int,
    in p_UserId int
)
begin
    declare v_CreatedBy int default null;
         select CreatedBy
         into v_CreatedBy
         from Groups
         where GroupId = p_GroupId;
    
    if v_CreatedBy is null then
       
       signal sqlstate '45000'
       set message_text = 'Group not found';
       
    end if;
    
    if v_CreatedBy != p_UserId then
       signal sqlstate '45000'
       set message_text = 'Only group creator can delete this group';
       
    end if;
    
    start transaction;
    delete from ExpenseParticipants
    where ExpenseId in
    (
        select ExpenseId
        from Expenses
        where GroupId = p_GroupId
        );
    delete from Settlements
    where GroupId = p_GroupId;

    delete from Expenses
    where GroupId = p_GroupId;

    delete from GroupMembers
    where GroupId = p_GroupId;
    
    delete from Groups
    where GroupId = p_GroupId;

    commit;

    select p_GroupId as GroupId;
end $$

delimiter ;