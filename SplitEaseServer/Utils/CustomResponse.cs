namespace SplitEase.Utils;

public class CustomResponse
{
    public CustomResponse()
    {
        IsSuccess = false;
        StatusCode = 200;
    }

    public bool IsSuccess { get; set; }

    public object? Data { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public string? Severity { get; set; }

    public int StatusCode { get; set; }
}