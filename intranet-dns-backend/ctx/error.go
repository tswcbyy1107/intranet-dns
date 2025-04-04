package ctx

import "fmt"

// self errors

var (
	// db errors
	ErrDbQuery       = &Errors{Code: 1001001, Message: "DB: Query DB Error"}
	ErrDbUpdate      = &Errors{Code: 1001002, Message: "DB: Update DB Error"}
	ErrDbInsert      = &Errors{Code: 1001003, Message: "DB: Insert DB Error"}
	ErrDbTransaction = &Errors{Code: 1001004, Message: "DB: Transaction Failed"}
	// system errors
	ErrParams     = &Errors{Code: 2001001, Message: "SYS: Invalid Params %v"}
	ErrLogin      = &Errors{Code: 2001002, Message: "SYS: User Login Failure"}
	ErrApi        = &Errors{Code: 2001003, Message: "SYS: Api Disabled"}
	ErrPermission = &Errors{Code: 2001003, Message: "SYS: Permission Deny"}
)

type Errors struct {
	Code    int    `json:"code,omitempty"`    // self error code
	Message string `json:"message,omitempty"` // self error message
}

func (e *Errors) Error() string {
	return e.Message
}

func (e *Errors) String() string {
	return fmt.Sprintf("err_code: %v, err_message:%v", e.Code, e.Message)
}

// format args in self error
func FormatErr(e *Errors, arg interface{}) *Errors {
	return &Errors{
		Code:    e.Code,
		Message: fmt.Sprintf(e.Message, arg),
	}
}
