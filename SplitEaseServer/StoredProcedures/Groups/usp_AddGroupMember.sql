delimiter $$

create procedure usp_AddGroupMember(
    in p_GroupId int,
    in p_Mobile varchar(20)
)
begin
    declare v_UserId int default null;
    declare v_GroupExists int default 0;
    declare v_AlreadyMember int default 0;
            
    select count(*)
    into v_GroupExists
    from `Groups`
    where GroupId = p_GroupId;

    if v_GroupExists = 0 then
       signal sqlstate '45000'
       set message_text = 'Group not found';
       
    end if;
    
    select UserId
    into  v_UserId
    from Users
    where Mobile = p_Mobile
    limit 1;

    if v_UserId is null then
       signal sqlstate '45000'
       set message_text = 'User not found';
       
    end if;
    
    select count(*)
    into v_AlreadyMember
    from GroupMembers
    where GroupId = p_GroupId
        and UserId = v_UserId;

    if v_AlreadyMember > 0 then
       signal sqlstate '45000'
       set message_text = 'User already in group';
       
    end if;
    
    insert into GroupMembers
    (
     GroupId,
     UserId,
     JoinedAt
    )
    values 
        (
         p_GroupId,
         v_UserId,
         now()
        );
    
    select 
        gm.GroupMemberId,
        gm.GroupId,
        gm.UserId,
        u.Name,
        u.Mobile,
        gm.JoinedAt
    from GroupMembers gm
    inner join Users u
        on u.UserId = gm.UserId
    where gm.GroupId = p_GroupId
        and gm.UserId = v_UserId;
end $$

delimiter ;