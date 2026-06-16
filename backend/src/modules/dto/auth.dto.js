import * as z from 'zod'

const signupValidateSchema = z.object({
    username: z.string().trim().min(4, "Minimum length should be 4"),
    email: z.email(),
    password: z.string().min(8, "Minimum length should be 8")
})

const loginValidateSchema = z.object({
    email: z.string().min(4),
    password: z.string().min(8, "Password is required.")
})

export{
    signupValidateSchema,
    loginValidateSchema
}


