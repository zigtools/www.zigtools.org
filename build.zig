const std = @import("std");
const zine = @import("zine");

pub fn build(b: *std.Build) !void {
    zine.website(b, .{
        .title = "Zigtools",
        .host_url = "https://zigtools.org",
        .layouts_dir_path = "layouts",
        .content_dir_path = "content",
        .assets_dir_path = "assets",
        .static_assets = &.{
            "robots.txt",
            // Used in inlined html
            "0.14.0-hover-over-character-literal.png",
            "0.14.0-hover-over-character-literal-dark.png",
        },
        .image_size_attributes = true,
    });
}
