import math

def quadratic(a, b, c):
    rt = math.sqrt(abs(b**2 - (4 * a * c)))
    top1 = -b + rt
    top2 = -b - rt
    t1 = top1 / (2 * a)
    t2 = top2 / (2 * a)
    return t1, t2

def freefall(h):
    # at^2/2
    h *= 2/9.8
    t = math.sqrt(h)
    return t

def projectile(h, v, angle):
    angle = math.radians(angle)
    vX = v * math.cos(angle)
    vY = v * math.sin(angle)

    # find time to top
    tTop = vY / 9.8
    # find height at top
    hMax = KtoUgHeight(vY)
    hMax += h
    # find total time to rise and fall
    tTotal = freefall(hMax) + tTop
    # find horizontal distance covered
    xDistance = tTotal * vX
    return xDistance

def KtoUgHeight(v):
    k = 0.5 * (v**2)
    h = k / 9.8
    return h

def energySlope(angle, v, friction):
    angle = math.radians(angle)
    energy = 0.5 * (v**2)
    temp = (math.sin(angle) + (friction * math.cos(angle))) * 9.8
    d = energy / temp
    return d

def InelasticRodCollision(M, L, m, v):
    clayInertia = m * ((L/2) ** 2)
    clayW = v / (L/2)
    barInertia = (1/12) * M * (L**2)
    finalW = (clayInertia * clayW) / (clayInertia + barInertia)

    cm = (1/(M+m)) * (0.075 * 0.15)
    d = (L/2) - cm
    torque = 9.8 * (M+m) * d
    accel = torque / (clayInertia + barInertia)
    angle1 = (finalW ** 2) / (2 * accel)
    angle1 *= (180/math.pi)
    print(angle1)

    energy = 0.5 * (clayInertia + barInertia) * (finalW**2) # Not sure if it is energy of bar + clay or just clay
    h = energy / (m * 9.8)
    ah = ((L/2) - h) / (L/2)
    angle2 = math.acos(ah)
    angle2 *= (180/math.pi)
    print(angle2)

InelasticRodCollision(0.075, 0.3, .01, 4.5)