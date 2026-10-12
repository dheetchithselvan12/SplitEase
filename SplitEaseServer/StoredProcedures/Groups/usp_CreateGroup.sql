delimiter $$

create procedure usp_CreateGroup(
    in p_Name varchar(150),
    in p_Description varchar(255),
    in p_CreatedBy int
)
    
    begin
        declare v_GroupId int;
        start transaction ;
        
        insert into `Groups`
        (
          Name,
         Description,
         CreatedBy,
         CreatedAt
        )
        values 
            (
             p_Name,
             p_Description,
             p_CreatedBy,
             now()
            );
        set v_GroupId = last_insert_id();
        insert into GroupMembers
        (
         GroupId,
         UserId,
         JoinedAt
        )
        values 
            (
             v_GroupId,
             p_CreatedBy,
             now()
            );
        commit;

        select 
            g.GroupId,
            g.Name,
            g.Description,
            g.CreatedBy,
            g.CreatedAt
        from `Groups` g
        where g.GroupId = v_GroupId;
    end $$
          
delimiter ;