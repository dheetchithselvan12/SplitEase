using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using SplitEase.Utils;

namespace SplitEase.Services.GroupService;

public interface IGroupService
{
    Task<CustomResponse> ViewInit(int userId);
    Task<CustomResponse> PageInit(int id);
    Task<CustomResponse> Create(JObject obj, int userId);
    Task<CustomResponse> AddMember(JObject obj);
    Task<CustomResponse> Delete(int id, int userId);
}