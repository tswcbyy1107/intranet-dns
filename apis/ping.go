package apis

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tswcbyy1107/dns-service/ctx"
	"github.com/tswcbyy1107/dns-service/models"
)

// @Summary     service ping api
// @Production  http service health check
// @Tags        health
// @Param       mock  query   string           false  "mock"
// @Success     200   object  ctx.StdResponse  "pong"
// @Router      /api/v1/ping [GET]
func pingHandler(c *gin.Context) {
	mock := c.DefaultQuery("mock", "true")
	if mock == "false" {
		ctx.FailedRsp(c, models.FormatErr(models.ErrParams, "mock"))
		return
	}
	ctx.SucceedRsp(c, "pong", nil)
}

// register ping test api in router's engine
func LoadPingApis(r *gin.Engine) {
	apis := []models.Api{
		{Path: "/ping", Method: http.MethodGet, Description: "服务测试ping接口", Handler: pingHandler},
	}
	loadApi(r, ginGroupApiV1, apis)
}
