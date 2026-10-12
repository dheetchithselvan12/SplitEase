delimiter $$

create procedure usp_GetUserGroups(
    in p_UserId int
)
begin  
    select 
        g.GroupId,
        g.Name,
        g.Description,
        g.CreatedBy,
        g.CreatedAt,
        count(gm2.GroupMemberId) as MemberCount
    from `Groups` g
    inner join GroupMembers gm
        on gm.GroupId = g.GroupId
        and gm.UserId = p_UserId
    left join GroupMembers gm2
        on gm2.GroupId = g.GroupId
    group by 
        g.GroupId, 
        g.Name, 
        g.Description, 
        g.CreatedBy, 
        g.CreatedAt
    order by g.CreatedAt desc;

end $$

delimiter ;