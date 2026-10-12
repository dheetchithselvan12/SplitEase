using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using SplitEase.Utils;

namespace SplitEase.Services.SettlementService;

public interface ISettlementService
{
    Task<CustomResponse> ViewInit(int groupId);

    Task<CustomResponse> Create(JObject obj);
}