using System.Data;
using System.Data.Common;
using System.Text.Json.Nodes;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Models;
using SplitEase.Utils;

namespace SplitEase.Services.GroupService;

public class GroupService : IGroupService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;
    private readonly CustomResponse _res = new();
    private readonly GroupDto _dto = new();

    public GroupService(AppDbContext context)
    {
        _context = context;
        _conn = context.Database.GetDbConnection();
    }

    public async Task<CustomResponse> ViewInit(int userId)
    {
        try
        {
            Console.WriteLine("req : ", userId);
            _dto.GroupList =
            (
                await _conn.QueryAsync<GroupListDto>(
                    "usp_GetUserGroups",
                    new
                    {
                        p_UserId = userId
                    },
                    commandType: CommandType.StoredProcedure
                )
            ).ToList();

            _res.IsSuccess = true;
            _res.Data = _dto;
        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }

    public async Task<CustomResponse> PageInit(int id)
    {
        try
        {
            if (id <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Invalid Group Id.";

                return _res;
            }

            using var multi =
                await _conn.QueryMultipleAsync(
                    "usp_GetGroupDetails",
                    new
                    {
                        p_GroupId = id
                    },
                    commandType: CommandType.StoredProcedure
                );

            _dto.GroupDetail =
                await multi.ReadFirstOrDefaultAsync<GroupDetailDto>();

            if (_dto.GroupDetail == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Not found";
                _res.Message = "Group not found.";

                return _res;
            }

            _dto.GroupMembers = (await multi.ReadAsync<GroupMemberDto>()).ToList();

            _res.IsSuccess = true;
            _res.Data = _dto;
        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }

    public async Task<CustomResponse> Create(JObject obj, int userId)
    {
        try
        {
            var groupPayload = obj["Group"] as JObject ?? obj;
            var group = groupPayload.ToObject<Group>();

            if (group == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Group payload is required.";

                return _res;
            }

            if (string.IsNullOrWhiteSpace(group.Name))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Group Name is required.";

                return _res;
            }

            var createdGroup =
                await _conn.QueryFirstOrDefaultAsync<Group>(
                    "usp_CreateGroup",
                    new
                    {
                        p_Name = group.Name,
                        p_Description = group.Description,
                        p_CreatedBy = userId
                    },
                    commandType: CommandType.StoredProcedure
                );

            if (createdGroup == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Error";
                _res.Message = "Unable to create group.";

                return _res;
            }

            _res.IsSuccess = true;
            _res.Title = "Created";
            _res.Message = "Group Created Successfully";
            _res.Data = createdGroup;

        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }

    public async Task<CustomResponse> AddMember(JObject obj)
    {
        try
        {
            var memberPayload = obj["Member"] as JObject ?? obj;
            var member = memberPayload.ToObject<AddGroupMemberDto>();

            if (member == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Member payload is required.";

                return _res;
            }

            if (member.GroupId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Group Id is required.";

                return _res;
            }

            if (string.IsNullOrWhiteSpace(member.Mobile))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Mobile number is required.";

                return _res;
            }

            var addedMember = await _conn.QueryFirstOrDefaultAsync<GroupMemberDto>(
                "usp_AddGroupMember",
                new
                {
                    p_GroupId = member.GroupId,
                    p_Mobile = member.Mobile
                },
                commandType: CommandType.StoredProcedure
                );

            _res.IsSuccess = true;
            _res.Title = "Created";
            _res.Message = "Member Added Successfully";
            _res.Data = addedMember;
        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }

    public async Task<CustomResponse> Delete(int id, int userId)
    {
        try
        {
            await _conn.ExecuteAsync(
                "usp_DeleteGroup",
                new
                {
                    p_GroupId = id,
                    p_UserId = userId
                },
                commandType: CommandType.StoredProcedure
                );

            _res.IsSuccess = true;
            _res.Title = "Deleted";
            _res.Message = "Group Deleted Successfully.";
        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }
}
